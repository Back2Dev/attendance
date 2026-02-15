import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { check } from 'meteor/check'
import { DateTime } from 'luxon'
import cloneDeep from 'lodash/cloneDeep'
import logger from '/imports/lib/log'
import { Jobs, Tasks } from '/imports/api/workflows/schema'
import { Participants } from '/imports/api/participants/schema'
import Listings from '/imports/api/listings/schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import Profiles from '/imports/api/profiles/schema'
import Surveys from '/imports/api/surveys/schema'
import TaskActions from '/imports/api/task-actions/schema'
import templates from '/imports/api/messages/templates'
import { doMerge, findFields } from '/imports/api/utils/merge'
import CONSTANTS from '/imports/api/constants'
import {
  createSMS,
  createEmail,
  createApp,
  sendAllMessages,
  createMeteorMethod,
} from '/imports/api/messages/functions'
import { getUserId } from '/imports/api/users/utils'
import { evaluateLogic } from '/imports/api/workflows/bots'
import { accessByPath, accessByPathPlus } from '../util'
import Messages from '../messages/schema'
import { activateWorkshop } from '/imports/api/workflows/functions-ekit'
import { getWorkshopEvent } from '/imports/api/workshops/utils'
import Workshops from '../workshops/schema'
import { getEmailAttachments } from '/imports/api/message-templates/server/utils'
import { getScheduleTime } from '/imports/api/reminder-plans/functions'

const debug = require('debug')('app:wf:fns')

const { APPTemplate, SMSTemplate, HTMLTemplate } = templates.get(
  Meteor.settings.public.env
)
export const setNextWorkflowType = async (listing, dispatch = false) => {
  const { _id, jurisdiction, wfSlug } = listing
  if (!jurisdiction) {
    logger.error(`Missing jurisdiction for listing id ${_id}`, { data: listing })
    return listing
  }

  const next = CONSTANTS.NEXT_WORKFLOWS.find(
    (wf) => wf.transactionType === listing.transactionType
  )
  if (next) {
    if (wfSlug !== jurisdiction + next.nextWorkflowSuffix) {
      await Listings.updateAsync(_id, {
        $set: { nextWorkflow: jurisdiction + next.nextWorkflowSuffix },
      })
      if (!dispatch) {
        listing.transactionType = next.nextTransactionType
      }
    }
  } else {
    logger.info(`Could not find the next workflow for property ${listing.shortAddress}`)
  }
  logger.info(`Updated nextWorkflow for property ${listing.shortAddress}`)
  return listing
}

export const webformOpen = async (task) => {
  const job = await Jobs.findOneAsync(task.jobId)
  if (!job) throw new Meteor.Error('job not found')
  const listing = await Listings.findOneAsync(job.listingId)
  if (!listing) throw new Meteor.Error('listing not found')
  const practice = await Practices.findOneAsync(
    { state: 'vic', active: true },
    { hint: 'by_active_state' }
  )
  const webDoc = listing.docs.find((doc) => doc.type === task.doctype)
  if (!webDoc) {
    debug(`Opening web form for ${task.doctype}`)
    //create a webform record, and push a document onto the stack
    const survey = await Surveys.findOneAsync({
      slug: task.webform || task.doctype,
      active: true,
    })
    if (!survey) throw new Meteor.Error(`Survey not found for ${task.doctype}`)
    const formData = {}
    if (task.doctype === 'cdc') {
      formData['practice-name'] = practice?.name
    }
    const webDoc = {
      type: task.doctype,
      surveyId: survey._id,
      formData,
      formStatus: 'progress',
      who: Meteor.userId(),
    }
    webDoc.formData.customers = listing.persons
      .filter((person) => person.role === 'PART')
      .map(({ name, mobile, email, primary }) => {
        return {
          name,
          mobile,
          email,
          primary,
        }
      })
    await Listings.updateAsync(listing._id, { $push: webDoc })
  }
}

export const updateWebform = async (id, webform) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }

    const set = {
      $set: {
        webform,
      },
    }
    const n = await Tasks.updateAsync(id, set)

    return { status: 'success', n }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

export const nextActions = async () => {
  try {
    let done = false
    let n = 0
    while (!done) {
      // find the next available taskAction - This is using the database as a "lock" to protect against race conditions
      const ret = await TaskActions.rawCollection().findOneAndUpdate(
        { status: 'ready' },
        {
          $set: {
            status: 'pending',
          },
        }
      )
      const tid = ret?._id
      if (!tid) {
        if (n) debug(`No more taskActions (I processed ${n})`)
        done = true // No more in queue
      } else {
        const action = await TaskActions.findOneAsync({ _id: tid })
        debug(`Action ready: ${action.slug}  ${action.action} ${action._id}`)
        const result = await taskAction(action.action, action.taskId)

        const status = result?.status === 'success' ? 'complete' : 'failed'
        debug(
          `Played ${action.sortOrder} action:${action.action} ${action.slug} ${
            action.taskId
          } result:${status} ${result.message || ''}`
        )
        const update = await TaskActions.updateAsync(action._id, {
          $set: {
            status,
            reason: result.message,
          },
        })
        n = n + update
        if (action.action === 'ready') {
          await shouldTaskAutoComplate(action.taskId)
        }
      }
    }
  } catch (e) {
    console.error(e)
    debug(`Error in nextActions: ${e.message}`)
  }
}

let sortOrder = 0
export const queueAction = async (action, taskId, slug) => {
  debug(`Queuing task.${action} ${taskId} ${slug}`)
  const id = await TaskActions.insertAsync({
    taskId,
    sortOrder,
    action,
    slug,
  })
  sortOrder = sortOrder + 1
  return id
}

// This task may be ready, check it out!
//
export const maybeReady = async (task) => {
  if (!task?.assignedTo) return // Doesn't apply to unassigned tasks
  const slugs = task.depends?.map((dep) => dep.id) || []
  const preds = await Tasks.find(
    { jobId: task.jobId, slug: { $in: slugs }, hidden: { $ne: true } },
    { hint: 'by_jobId_slug_status' }
  ).fetchAsync()
  const isReady = preds.every((t) => ['skipped', 'complete'].includes(t.status))

  if (isReady && task.status !== 'ready')
    return await queueAction('ready', task._id, task.slug)
  else
    debug(
      `Preds for ${task.slug} (${task.status}) are not done (${preds
        .map((t) => `${t.slug}: ${t.status}`)
        .join(', ')})`
    )
}

// Follow dependencies - first find the tasks that depend on this one,
// then see if all of the dependencies are satisfied
export const followDeps = async (task) => {
  if (!task.assignedTo && task.responsible !== 'System') return // Doesn't apply to unassigned tasks
  // Only make other tasks ready if this wasn't complete already
  const slugs = task.depends?.map((dep) => dep.id) || []
  const depends = await Tasks.find(
    { jobId: task.jobId, 'depends.id': task.slug, assignedTo: { $exists: true } },
    { hint: 'by_jobId_depends_slug' }
  ).fetchAsync()

  for (const dep of depends) {
    await maybeReady(dep, true) // 2nd param is "Don't update the job"
    await nextActions()
  }
}

const executeLogic = async (task, re) => {
  if (!task.logic) {
    return
  }
  await Promise.all(
    task.logic
      ?.split(/\n/)
      .filter((logic) => logic) // Skips blank lines
      .map(async (logic) => {
        const m = logic.match(re)
        if (m) {
          const tasks = await Tasks.find(
            { jobId: task.jobId, slug: m[2] },
            { hint: 'by_jobId_slug_status' }
          ).fetchAsync()

          if (tasks.length) {
            for (const t of tasks) {
              await queueAction(m[1], t._id, t.slug)
              await nextActions()
            }
          }
        } else {
          await evaluateLogic(task._id, 'after')
        }
      })
  )
}

export const taskComplete = async (id, options = {}) => {
  try {
    const { single = false, touch = false } = options
    const task = await Tasks.findOneAsync(id)

    if (!task) return { status: 'failed', message: 'task not found' }
    if (['blocked', 'skipped'].includes(task.status))
      return {
        status: 'failed',
        message: `Cannot complete task ${task.slug} - it is ${task.status}`,
      }
    if (task.status === 'complete') {
      // Do we need to touch the record?
      if (touch)
        await Tasks.updateAsync(id, {
          $set: {
            sortOrder: task.sortOrder + 1,
          },
        })
      await notify(task, 'complete') // Do the notifications again
      await followDeps(task) // See what comes next
      await nextActions()
      debug(`Task ${task.slug} for ${task.responsible} is already complete`)
      return {
        status: 'success',
        message: `Task is already complete`,
      }
    }
    const n = await Tasks.updateAsync(id, {
      $set: {
        status: 'complete',
        progress: 100,
        completedAt: new Date(),
        completedBy: getUserId(),
      },
    })
    debug(`Task ${id} (${task.slug}) completed `)
    await executeLogic(task, /after if completed (\w+) ([\w\-]+)/)
    await notify(task, 'complete')
    await followDeps(task)
    await nextActions()
    await updateJob(id)
    return { status: 'success', message: `Step "${task.name}" was completed` }
  } catch (err) {
    debug('error when completing task', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskSkip = async (id, note) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `taskSkip task ${id} not found` }
    debug(`Skip ${id} ${task.slug}`)
    if (!['ready', 'blocked'].includes(task.status))
      return {
        status: 'failed',
        message: `Cannot skip task ${task.slug} - it is ${task.status}`,
      }
    const set = {
      $set: {
        status: 'skipped',
        completedAt: new Date(),
      },
    }
    if (note) set.$push = { notes: { name: 'skipped', description: note } }
    const n = await Tasks.updateAsync(id, set)

    // Follow dependencies and set dependant tasks to be ready
    await executeLogic(task, /after if skipped (\w+) ([\w\-]+)/)

    await notify(task, 'skip')
    await followDeps(task)
    await nextActions()
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    debug('error when skipping task', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskSkipall = async (id) => {
  try {
    debug(`taskSkipall(${id})`)
    let n
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `taskSkipall task ${id} not found` }
    if (!['ready', 'blocked'].includes(task.status))
      // return {
      //   status: 'failed',
      //   message: `Cannot complete task ${task.slug}: it is ${task.status}`,
      // }
      debug(`Cannot skip task ${task.slug}: it is ${task.status}`)
    else
      n = await Tasks.updateAsync(id, {
        $set: { status: 'skipped', completedAt: new Date() },
      })
    // Now iterate through the following tasks, skipping those as well (if they have a single dependency)
    let slug = task.slug
    let lastSlug = task.slug
    do {
      debug(`Finding dependents of ${slug}`)
      const [dep] = await Tasks.find(
        {
          jobId: task.jobId,
          'depends.id': slug,
          depends: { $size: 1 },
        },
        { hint: 'by_jobId_depends_slug' }
      ).fetchAsync()
      if (dep) {
        // Mark this task as skipped too
        debug(`Skipping ${dep.slug} (was ${dep.status})`)
        n =
          n +
          (await Tasks.updateAsync(dep._id, {
            $set: { status: 'skipped', completedAt: new Date() },
          }))
        lastSlug = slug = dep.slug // Get the next slug to follow the chain
      } else slug = ''
    } while (slug)

    // Follow dependencies and set dependant tasks to be ready
    const m = await Tasks.find(
      { jobId: task.jobId, 'depends.id': lastSlug },
      { hint: 'by_jobId_depends_slug' }
    ).fetchAsync()

    await Promise.all(
      m.map(async ({ _id, slug }) => {
        debug(`Setting ${slug} to ready`)
        //TODO: email-tasks: Trigger notification on ready
        return await Tasks.updateAsync(_id, {
          $set: { status: 'ready', readyAt: new Date() },
        })
      })
    )
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    debug('error when skipping all tasks', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskDeleteNote = async (id, note) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `taskDeleteNote task ${id} not found` }
    // Audit is different, because we are removing the task, so it won't be found by the audit updater
    logger.audit(`Task deleted: ${note}`, { task, jobId: task.jobId, reason: note })
    // TODO: Work out if we really need to hide the task when deleting a note? Does not compute!
    const set = { hidden: true }
    if (note) set.$push = { notes: { name: 'deleted', description: note } }
    const n = await Tasks.updateAsync(id, { $set: set })
    return { status: 'success', n }
  } catch (err) {
    debug('error when deleting task', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskRemove = async (taskId) => {
  const task = await Tasks.findOneAsync(taskId)
  if (!task)
    return { status: 'failed', message: `taskDeleteNote task ${taskId} not found` }
  const jobId = task.jobId
  try {
    await Tasks.removeAsync(taskId) // Remove the task
    logger.audit(`Task deleted: `, { task, jobId, reason: 'User request' })
    await Jobs.updateAsync({ _id: jobId }, { $pull: { docs: { type: task.doctype } } })

    return { status: 'success', message: `Task: "${task.name}" deleted successfully` }
  } catch (error) {
    debug('error when deleting task', err)
    return {
      status: 'failed',
      message: `Error deleting task ${taskId}: ${error.message}`,
    }
  }
}

export const taskOpen = async (id) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `taskOpen task ${id} not found` }
    if (task.status !== 'ready')
      return { status: 'failed', message: 'Cannot open task - it is ${task.status}' }
    switch (task.type) {
      case 'webform':
        await webformOpen(task)
        return { status: 'success', message: 'ok' }
        break
      default:
        return { status: 'success', message: 'ok' }
    }
  } catch (err) {
    debug('error when opening task', err)
    return { status: 'failed', message: err.message }
  }
}

// TODO: What is this for ?????
export const taskActivate = async (id) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `taskActivate task ${id} not found` }
    if (task.status !== 'blocked')
      return { status: 'failed', message: `Cannot ready task - it is ${task.status}` }
    //TODO: email-tasks: Trigger notification on ready
    return await Tasks.updateAsync(id, { $set: { status: 'ready', readyAt: new Date() } })
  } catch (err) {
    debug('error when opening task', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskReject = async (id, note) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: 'task not found' }
    if (task.status === 'blocked')
      return {
        status: 'failed',
        message: `Cannot reject task ${task.slug} - it is ${task.status}`,
      }
    let n = await Tasks.updateAsync(id, {
      $set: {
        status: 'rejected',
        completedAt: new Date(),
        completedBy: getUserId(),
      },
    })

    const job = await Jobs.findOneAsync({ _id: task.jobId })
    const listing = await Listings.findOneAsync({ _id: job.listingId })

    const userId = Meteor.userId()
    const name = (await Profiles.findOneAsync({ userId })).name

    listing.notes.push({
      _id: Random.id(),
      name,
      doctype: task.doctype,
      description: note,
      who: userId,
      readBy: [{ name, userId }],
      when: new Date(),
    })
    debug('update note ', listing.notes)
    await Listings.updateAsync(listing._id, { $set: listing })

    debug(`Task ${id} (${task.slug}) rejected `)
    await executeLogic(task, /after if rejected (\w+) ([\w\-]+)/)
    await notify(task, 'reject')
    await nextActions()
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    debug('error when rejecting task', err)
    return { status: 'failed', message: err.message }
  }
}

export const completeListing = async (taskId) => {
  try {
    const { _id, jobId } = await Tasks.findOneAsync(taskId)
    if (!_id) throw new Meteor.Error(`completeListing task ${taskId} not found`)
    const { listingId } = await Jobs.findOneAsync(jobId)
    await Listings.updateAsync(listingId, {
      $set: { status: 'complete', completedAt: new Date() },
    })
  } catch (e) {
    console.error(e)
  }
}

/*
 * Utility function to update a job after a task has been updated.
 * It does the following:
 *  - Tallies tasks by status
 *  - Calculates percentage complete
 */
export const updateJob = async (taskId) => {
  debug('updateJob()', { taskId })
  const { jobId, name } = (await Tasks.findOneAsync(taskId)) || {}
  if (!jobId) {
    console.error(`updateJob task ${taskId} not found`, taskId)
    throw new Meteor.Error(`updateJob task ${taskId} not found`)
  }
  const jobTasks = await Tasks.find(
    {
      jobId,
      hidden: { $ne: true },
    },
    { hint: 'by_jobId' }
  ).fetchAsync()
  const tasks = jobTasks.filter(
    (t) =>
      ['WSADM', 'PART', 'BOSS', 'PEER', 'KOI'].includes(t.role) &&
      !t.internal &&
      ['blocked', 'ready', 'complete'].includes(t.status) &&
      !t.hidden
  )
  // Get the roles involved...
  const roles = tasks.reduce((acc, t) => {
    if (!acc.includes(t.role) && t.status !== 'removed') acc.push(t.role)
    return acc
  }, [])

  const getCounts = (tasks, keys) =>
    tasks.reduce(
      (acc, t) => {
        acc[t.status] = acc[t.status] ? acc[t.status] + 1 : 1
        return acc
      },
      keys.reduce((acc, status) => {
        acc[status] = 0
        return acc
      }, {})
    )
  // Count the tasks by status
  const counts = getCounts(tasks, Object.keys(CONSTANTS.STEP_STATUS))
  // Count the tasks by role and by status
  const roleCounts = {}
  roles.forEach((role) => {
    roleCounts[role] = getCounts(
      tasks.filter((t) => t.role === role && t.assignedTo),
      Object.keys(CONSTANTS.STEP_STATUS)
    )
    roleCounts[role].total = Object.keys(CONSTANTS.STEP_STATUS).reduce((n, status) => {
      return n + roleCounts[role][status]
    }, 0)
    roleCounts[role].progress =
      Math.floor((100 * roleCounts[role].complete) / roleCounts[role].total) || 0
  })
  const values = {
    counts,
    roleCounts,
    complete: counts.complete || 0,
    total: Object.keys(CONSTANTS.STEP_STATUS).reduce((n, status) => {
      return n + counts[status]
    }, 0),
  }
  values.progress = Math.floor((100 * values.complete) / values.total) || 0
  values.lastStep = { taskId, name }
  const readyTasks = await Tasks.find(
    {
      jobId,
      status: 'ready',
      role: { $in: ['WSADM', 'PART', 'BOSS', 'PEER'] },
    },
    { hint: 'by_jobId_status_role' }
  ).fetchAsync()
  values.nextStep = readyTasks.map((task) => ({ taskId: task._id, name: task.name }))
  // values.nextStep = await (
  // Tasks.find(
  //   {
  //     jobId,
  //     status: 'ready',
  //     role: { $in: ['WSADM', 'PART', 'PM'] },
  //   },
  //   { hint: 'by_jobId_status_role' }
  // ).mapAsync((task) => ({ taskId: task._id, name: task.name }))
  // )
  const remainingtasks = await Tasks.find(
    {
      jobId,
      status: { $in: ['ready', 'blocked'] },
    },
    { hint: 'by_jobId_status_role' }
  ).fetchAsync()
  // TODO: Handle this better (pending discussion)
  // if (!remainingtasks.length || values.progress === 100) {
  //   values.status = 'complete'
  // }

  debug(`updating job`)
  await Jobs.updateAsync(jobId, { $set: values })
  await sendAllMessages({})
}

const taskAudit = async (action, id) => {
  const task = await Tasks.findOneAsync(id)
  logger.audit(action, { taskId: id, jobId: task?.jobId })
}

const taskLog = async (action, id) => {
  const task = await Tasks.findOneAsync(id)
  logger.info(`${task._id}/${task.jobId} ${task.slug} ${action} (${task.responsible})`)
}

/**
 * Build login link information for a user
 * @param {Meteor.User} user
 * @returns {Object} loginurl, loginprompt, htmlloginprompt, loginhint
 */
export const getLoginLinkInfo = (user) => {
  const services = {
    Token: user?.services?.email?.confirmationToken?.token,
    Google: !!user?.services?.google,
    ['Email/Password']: !!user?.services?.password,
    Microsoft: !!user?.services?.microsoft,
  }

  let loginurl = Meteor.absoluteUrl('/')
  let loginprompt = 'Please login by clicking this link:'
  let htmlloginprompt = 'Please login by clicking this link:'
  let loginhint = ' '
  if (services.Token) {
    // This is mutually exlusive with other services
    loginprompt = 'Clicking this link will allow you to select a password:'
    htmlloginprompt = 'Clicking this link will allow you to select a password:'
    loginurl = Meteor.absoluteUrl(`/invited-signup/${services.Token}`)
  } else {
    loginhint = ' '
    if (services.length)
      loginhint = `Your account allows login with ${Object.keys(services)
        .filter((s) => services[s])
        .join(', ')}`
  }

  return {
    loginurl,
    htmlloginurl: `<a href="${loginurl}" >${loginurl}</a>`,
    loginprompt,
    htmlloginprompt,
    loginhint,
  }
}

/**
 * Passed in: a context object, containing task and job and maybe user
 * @param {object} context
 * @param {import('/imports/types/job').JobType} context.job
 * @param {import('/imports/types/task').TaskType | undefined} context.task
 * @param {string | undefined} context.userId
 * @returns {Promise<Object>} key/value pairs
 */
export const getValues = async (context) => {
  const { job, task, userId } = context || {}
  const { assignedTo, role } = task || {} // Prevent an exception if task is undefined

  const getRole = (role) => {
    let person = job?.persons.find(
      (p) => p.role === role && p.userId === (userId || assignedTo)
    )
    if (!person)
      // Try by role only if no assignment
      person = job?.persons.find((p) => p.role === role)
    return person ? person.nickname || person.name.split(/\s+/)[0] : ''
  }

  const getFull = (role) => {
    let person = job?.persons.find(
      (p) => p.role === role && p.userId === (userId || assignedTo)
    )
    if (!person)
      // Try by role only if no assignment
      person = job?.persons.find((p) => p.role === role)
    return person?.name || ''
  }

  const getEmail = (role) => {
    let person = job?.persons.find(
      (p) => p.role === role && p.userId === (userId || assignedTo)
    )
    if (!person)
      // Try by role only if no assignment
      person = job?.persons.find((p) => p.role === role)
    return person?.email || ''
  }

  const getPeers = (persons) => {
    let peers = persons.filter((person) => person.role === 'PEER')

    if (!peers || !peers.length) {
      return 'Key Personnel'
    }

    return peers.reduce((acc, current) => {
      let name = current.nickname ? current.nickname : current.name.split(/\s+/)[0]
      let comma = acc.length ? ' and ' : ''
      return acc + comma + name
    }, '')
  }

  const getCalendarLinks = async () => {
    if (!job) return null
    if (job.jobType === 'workshop') {
      // job is a workshop
      return getWorkshopEvent(job)
    }
    // need to get workshop
    const workshop = await Workshops.findOneAsync({ _id: job.workshopId })
    if (!workshop) return null
    return getWorkshopEvent(workshop)
  }
  const calendarLinks = await getCalendarLinks()

  let user = await Meteor.users.findOneAsync({ _id: userId || assignedTo })
  if (!user) {
    // TODO: What if user doesn't exist?
    const part = job?.persons.find((p) => p.role === 'PART')
    if (part) user = await Meteor.users.findOneAsync({ _id: part.userId })
  }

  // TODO: Work out person's timezone
  const person = {}
  const timeZone = person.timezone || CONSTANTS.DEFAULT_TIMEZONE

  const { loginurl, loginprompt, htmlloginprompt, loginhint } = getLoginLinkInfo(user)

  // find workshop admin from list of persons
  const wsadm = job?.persons.find((p) => p.role === 'WSADM')

  const data = {
    privacy: CONSTANTS.MESSAGE_URLS['privacy'],
    terms: CONSTANTS.MESSAGE_URLS['terms'],
    // Links
    url: Meteor.absoluteUrl(`/workshop/${job._id}`),
    taskurl: Meteor.absoluteUrl(`/form/${task?._id}`),
    // TODO: what if user doesn't have confirmation token?
    loginurl: loginurl,
    loginprompt,
    htmlloginprompt,
    loginhint,
    q10url: Meteor.absoluteUrl(`/r-${task?._id}`),
    q11url: Meteor.absoluteUrl(`/r-${task?._id}`),
    q15url: Meteor.absoluteUrl(`/r-${task?._id}`),

    himher: accessByPath(job, 'himher'),
    hisher: accessByPath(job, 'himher') === 'him' ? 'his' : 'her',

    // personalised for the workshop admin, these could be removed, in favour of using `wsadmname` etc
    adminphone: wsadm?.mobile || '818.793.5825',
    adminemail: wsadm?.email || 'ctwebb@mapconsulting.com',
    adminname: wsadm?.name || 'Cathy Webb',

    company: accessByPath(job, 'company'),
    location: accessByPath(job, 'workshop.location'),
    // D A T E S
    // This should be a string already
    workshopdate: accessByPath(job, 'workshop.dates'),
    startdate: DateTime.fromJSDate(accessByPath(job, 'workshop.startdate'))
      .setZone(timeZone)
      .toLocaleString(DateTime.DATE_SHORT),
    // D A T E S - F R O M   D A T E   O B J E C T
    invitedate: DateTime.fromJSDate(accessByPath(job, 'invitedate'))
      .setZone(timeZone)
      .toLocaleString(DateTime.DATE_SHORT),
    duedate: DateTime.fromJSDate(accessByPath(job, 'duedate'))
      .setZone(timeZone)
      .toLocaleString(DateTime.DATE_SHORT),
    peerDuedate: DateTime.fromJSDate(accessByPath(job, 'peerDuedate'))
      .setZone(timeZone)
      .toLocaleString(DateTime.DATE_SHORT),
    bossDuedate: DateTime.fromJSDate(accessByPath(job, 'bossDuedate'))
      .setZone(timeZone)
      .toLocaleString(DateTime.DATE_SHORT),
    workshopType: job.workshopType || job.workshop?.workshopType,

    // calendar links
    googleCalendar: calendarLinks?.google,
    outlookCalendar: calendarLinks?.outlook,
    office365Calendar: calendarLinks?.office365,
    yahooCalendar: calendarLinks?.yahoo,
  }
  data.htmlloginurl = `<a href="${data.loginurl}" target="_blank">${data.loginurl}</a>`

  const roles = 'PART BOSS PEER WSADM EXEC KOI'.split(/[\s+,]+/g)
  roles.forEach((role) => {
    const lcrole = role.toLowerCase()
    data[`${lcrole}nickname`] = getRole(role)
    data[`${lcrole}name`] = getFull(role)
    data[`${lcrole}email`] = getEmail(role)
  })
  Object.keys(data)
    .filter((key) => !key.match(/^html\w+/))
    .filter((key) => key.match(/url$/))
    .forEach((key) => {
      data[`html${key}`] = `<a href="${data[key]}" target="_blank">${data[key]}</a>`
    })

  return data
}

export const optedToSend = async (userId, method) => {
  debug('optedToSend', userId, method)
  const p = await Profiles.findOneAsync({ userId }, { fields: { notifyBy: 1 } })
  return !!p?.notifyBy.includes(method)
}

/**
 * This function allows us to send a notification to multiple users at a time.
 * @param {string} id
 * @param {object} trigger
 * @param {bool} force
 * @param {object} notiReceivers - Object containing a list of userIds
 * @returns
 */
export const taskNotify = async (id, trigger, force = false, notiReceivers) => {
  const task = await Tasks.findOneAsync(id)
  const job = await Jobs.findOneAsync(task.jobId)
  if (!task || !job) return { status: 'failed', message: `Task or job not found ${id}` }
  if (trigger === '*') {
    const triggers = task.notifications.reduce((acc, n) => {
      if (!acc.includes(n.trigger)) acc.push(n.trigger)
      return acc
    }, [])
    for (const t of triggers) {
      const notif = task.notifications.find((n) => n.trigger === t)
      if (notif) {
        for (const role of notif.recipients) {
          const slug = notif.text
          if (notiReceivers[slug][role]) {
            const userIds = Object.entries(notiReceivers[slug][role])
              .filter(([, value]) => value === true)
              .map(([key]) => key)
            for (const userId of userIds) {
              let theTask = await Tasks.findOneAsync({
                jobId: task.jobId,
                slug: task.slug,
                assignedTo: userId,
              })
              // Sometimes the task doesn't belong to the target user (eg w/s materials)
              // So allow for that...
              if (!theTask)
                theTask = await Tasks.findOneAsync({
                  jobId: task.jobId,
                  slug: task.slug,
                })
              if (theTask) await notify(theTask, t, force, role)
            }
          }
        }
      }
    }
  } else await notify(task, trigger, force)
  return { status: 'success', message: `Notification sent` }
}

export const notify = async (task, trigger, force = false, role) => {
  const job = await Jobs.findOneAsync(task.jobId)

  if (task.notifications) {
    for (const notif of task.notifications.filter((notif) => {
      const roleMatch = !role || notif.recipients.includes(role)
      return notif.trigger === trigger && roleMatch
    })) {
      // debug('notify', notif)

      if (notif.method === 'API') {
        await createMeteorMethod({ name: notif.text, args: [task] })
      } else {
        for (const recipRole of notif.recipients) {
          const slug = notif.text
          const template = await MessageTemplates.findOneAsync({ slug })
          let persons = job.persons
          persons = persons
            .filter((p) => p.email)
            .filter((p) => {
              return task.assignedTo && recipRole === task.role
                ? p.userId === task.assignedTo && p.role === recipRole
                : p.role === recipRole
            })

          const context = await getValues({
            task,
            job,
          })

          // debug('notify', { context, trigger, task })

          // debug(slug, persons)
          for (const person of persons) {
            const timezone = person.timezone || CONSTANTS.DEFAULT_TIMEZONE
            try {
              const nickname = person
                ? person.nickname || person.name.split(/\s+/)[0]
                : ''

              // ek-655 we need to generate login url for each user here, not in the getValues function as it is user specific
              const user = await Meteor.users.findOneAsync({ _id: person.userId })
              const userLinks = getLoginLinkInfo(user)
              Object.keys(userLinks).forEach((key) => (context[key] = userLinks[key]))
              // Have a look at the template(s), and see which fields are missing
              const mergeBody =
                template.type === 'EMAIL'
                  ? template.HTMLbody + template.body
                  : template.body
              const fields = findFields(mergeBody, {})
              const missing = Object.keys(fields).filter((field) => {
                if (!context[field])
                  // Try to fix missing fields
                  context[field] = accessByPathPlus(job, field)
                return !context[field]
              })
              debug({ nickname, q10url: context.q10url, taskId: task._id })
              const [data, body] = doMerge(
                cloneDeep({
                  context: {
                    ...context,
                    nickname,
                    // convert job dates to user timezone
                    timezone: timezone,
                  },
                  body: template.body,
                  template,
                })
              )
              let form = {
                jobId: job._id,
                data,
                body,
                slug: template.slug,
                priority: 5,
                userId: person.userId,
              }

              let sender
              if (notif.from) {
                // select person from job's persons
                sender = job?.persons.find((p) => p.role === notif.from)
              }

              switch (template.type) {
                case 'SMS':
                  if (!(await optedToSend(person.userId, 'SMS'))) {
                    logger.audit(`${person.userId} has opted out of receiving SMS.`, form)
                  }
                  if (!person.mobile) {
                    const mobile = await Profiles.findOneAsync({
                      userId: person.userId,
                    })?.mobile
                    if (!mobile) {
                      logger.info(`${person.name} is missing a phone number`)
                    }
                    form.to = mobile
                  } else {
                    form.to = person.mobile
                  }
                  await createSMS(form)
                  break
                case 'APP':
                  await createApp(form, person, template, job._id)
                  break
                case 'EMAIL': //
                  form.to = [{ email: person.email, name: person.name }]
                  form.userId = person.userId
                  // Fetch all the email sent for this job already
                  const sentMsgs = await Messages.find({
                    jobId: job._id,
                    type: 'email',
                    slug: form.slug,
                    'to.0.email': form.to[0].email,
                  }).fetchAsync()

                  if (notif.limit && sentMsgs.length && !force) {
                    debug(
                      `Message ${form.slug} has been sent to ${form.to[0].email} already ${sentMsgs.length} times`
                    )
                  } else {
                    if (sender) {
                      form.from = sender.email
                    } else {
                      // ek-622, when no sender is specified, as discussed with Mike, we stop sending emails
                      logger.error(
                        `No sender specified for email ${template.slug}, task ${task.slug}, job ${job._id}`
                      )
                      break
                    }
                    if (notif.fromName) {
                      form.from_name = notif.fromName
                    }
                    if (template.HTMLbody) {
                      const [HTMLdata, HTMLbody] = doMerge({
                        context: {
                          ...context,
                          nickname,
                          timezone: timezone,
                        },
                        HTMLbody: template.HTMLbody,
                        template,
                      })
                      form.data.html = HTMLdata.html
                    }

                    // ek-734, check if the template has attachmentMethod set
                    if (template.attachmentMethod) {
                      debug(
                        'template.attachmentMethod was set',
                        template.attachmentMethod
                      )
                      const r2 = await getEmailAttachments({
                        methodName: template.attachmentMethod,
                        participantId: job._id,
                      })
                      debug('getEmailAttachments result', r2)
                      if (r2.status === 'success' && r2.attachments.length) {
                        form.data.attachments = r2.attachments
                      }
                    }

                    const r = await createEmail(form, data.subject)
                    debug('create email result', r)
                  }
                  break
                default:
                  logger.error(
                    `Error: Method for sending message not found: type: ${notif.method}`
                  )
              }
            } catch (e) {
              console.error(e)
            }
          }
        }
      }
    }
  }
}

export const taskReady = async (id, note) => {
  try {
    // Check for pre-execution logic
    // TaskCheckLogic(id, 'before')
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }
    if (!['blocked', 'rejected', 'failed'].includes(task.status))
      return {
        status: 'failed',
        message: `Cannot ready task ${task.slug} - it is (${task.status})`,
      }
    if (task.status === 'ready')
      // Don't do it all again
      return { status: 'failed', message: 'Already ready' }

    await taskLog('Readied task', id) //
    // Execute ready logic

    await evaluateLogic(id, 'before')
    const readyAt = new Date()
    const set = {
      status: 'ready',
      readyAt,
    }

    // Add reminder whenever a task is ready
    if (task.reminderPlans) {
      set.reminderPlans = await getScheduleTime({ task })
    }
    if (note) set.$push = { notes: { name: 'readied', description: note } }

    const n = await Tasks.updateAsync(id, {
      $set: set,
    })
    debug(`Task ${id} (${task.slug}) is ready`)

    // call the procedure to update cms
    if (task.type === 'webform') {
      task.readyAt = readyAt
    }

    await notify(task, 'ready')
    // Look for other actions to take now
    await nextActions()
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

export const taskBlock = async (id, note) => {
  try {
    // Check for pre-execution logic
    // TaskCheckLogic(id, 'before')
    await taskLog('Blocked task', id) //
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }
    if (!['ready', 'skipped', 'failed'].includes(task.status))
      return {
        status: 'failed',
        message: `Cannot block task ${task.slug} - it is (${task.status})`,
      }
    // Execute block logic
    await evaluateLogic(id, 'blocked')
    const set = {
      status: 'blocked',
      // This doesn't make sense... because it's not ready here
      // readyAt: new Date(),
    }
    if (note) set.$push = { notes: { name: 'blocked', description: note } }

    const n = await Tasks.updateAsync(id, {
      $set: set,
    })
    debug(`Task ${id} (${task.slug}) is blocked`)

    await notify(task, 'blocked')
    await nextActions()
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    debug('error when blocking task', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskReopen = async (id) => {
  try {
    // Check for pre-execution logic
    // TaskCheckLogic(id, 'before')
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }
    if (!['blocked', 'complete'].includes(task.status))
      return {
        status: 'failed',
        message: `Cannot reopen task ${task.slug} - it is not openable (${task.status})`,
      }
    // Execute ready logic
    await evaluateLogic(id, 'before')
    const n = await Tasks.updateAsync(id, {
      $set: {
        status: 'ready',
        readyAt: new Date(),
      },
    })
    await resetReminder(id)
    debug(`Task ${id} (${task.slug}) is ready`)
    await notify(task, 'reopen')
    // Look for other actions to take now
    await nextActions()
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

export const taskReopenNote = async ({ id, notifyUsers = true, note }) => {
  try {
    // Check for pre-execution logic
    // TaskCheckLogic(id, 'before')
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }
    if (!['blocked', 'complete', 'skipped'].includes(task.status))
      return {
        status: 'failed',
        message: `Cannot reopen task ${task.slug} - it is not openable (${task.status})`,
      }
    // Execute ready logic
    await evaluateLogic(id, 'before')
    const set = {
      status: 'ready',
      readyAt: new Date(),
    }
    if (note) set.$push = { notes: { name: 'reopened', description: note } }
    const n = await Tasks.updateAsync(id, {
      $set: set,
    })
    await resetReminder(id)
    debug(`Task ${id} (${task.slug}) is ready`)
    if (notifyUsers) await notify(task, 'reopen')
    // Look for other actions to take now
    await nextActions()
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

export const taskReplacePersonByRole = async ({ id, role, user }) => {
  try {
    const { userId, name } = user
    check(userId, String)
    check(name, String)
    const job = await Jobs.findOneAsync(id)
    if (!job) return { status: 'failed', message: `Could not find job with id ${id}` }
    const n = await Tasks.updateAsync(
      {
        role: role,
        jobId: job._id,
        status: { $in: ['ready', 'blocked'] },
      },
      {
        $set: {
          responsible: name,
          assignedTo: userId,
        },
      },
      { multi: true }
    )
    if (n === 0) throw new Error('Could not update tasks')
    return { status: 'success', message: 'Updated user tasks with new user' }
  } catch (e) {
    return { status: 'failed', message: e.message }
  }
}

export const taskCompleteNote = async ({ id, notifyUsers, note }) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: 'task not found' }
    if (['blocked', 'complete', 'skipped'].includes(task.status))
      return {
        status: 'failed',
        message: `Cannot complete task ${task.slug} - it is ${task.status}`,
      }
    const set = {
      status: 'complete',
      completedAt: new Date(),
      completedBy: getUserId(),
    }
    if (note) set.$push = { notes: { name: 'completed', description: note } }
    const n = await Tasks.updateAsync(id, {
      $set: set,
    })
    debug(`Task ${id} (${task.slug}) completed `)
    await executeLogic(task, /after if completed (\w+) ([\w\-]+)/)
    if (notifyUsers) await notify(task, 'complete')
    await followDeps(task)
    await nextActions()
    await updateJob(id)
    return { status: 'success', message: `Step "${task.name}" was completed` }
  } catch (err) {
    debug('error when completing task with note', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskSwitch = async (id, userId, name) => {
  try {
    // Check for pre-execution logic
    // TaskCheckLogic(id, 'before')
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }
    if (!(await Meteor.users.findOneAsync(userId))) console.warn(`Target user not found`)
    // return { status: 'failed', message: `Target user not found` }
    await taskAudit(`Switched task ${task.responsible} => ${name}`, id, userId, name)
    if (['skipped', 'complete'].includes(task.status))
      return {
        status: 'failed',
        message: `Task ${task.slug} cannot be switched, status is ${task.status}`,
      }
    if (task.assignedTo === userId)
      return {
        status: 'failed',
        message: `Task ${task.slug} is already assigned to ${name}`,
      }
    const n = await Tasks.updateAsync(id, {
      $set: {
        assignedTo: userId,
        responsible: name,
      },
    })
    debug(`Task ${id} (${task.slug}) is switched`)
    await updateJob(id)
    return { status: 'success', n }
  } catch (err) {
    debug('error when switching task', err)
    return { status: 'failed', message: err.message }
  }
}

export const taskCreated = async (id) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }
    // Execute create logic

    await evaluateLogic(id, 'create')
    // Notify the world of task creation events
    await notify(task, 'create')

    return { status: 'success' }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

export const taskHide = async (id) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }

    const set = {
      $set: {
        hidden: true,
      },
    }
    const n = await Tasks.updateAsync(id, set)

    await notify(task, 'hide')
    await followDeps(task)
    await nextActions()
    await updateJob(id)

    return { status: 'success', n }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

export const taskHideToggle = async (id) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }
    const hidden = !Boolean(task.hidden)

    const set = {
      $set: {
        hidden,
      },
    }
    const n = await Tasks.updateAsync(id, set)

    await notify(task, 'hide')
    await followDeps(task)
    await nextActions()
    await updateJob(id)

    return { status: 'success', n }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

export const taskShow = async (id) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) return { status: 'failed', message: `task not found` }

    const set = {
      $set: {
        hidden: false,
      },
    }
    const n = await Tasks.updateAsync(id, set)

    await notify(task, 'show')
    await followDeps(task)
    await nextActions()
    await updateJob(id)

    return { status: 'success', n }
  } catch (err) {
    console.error(err)
    return { status: 'failed', message: err.message }
  }
}

// se-672
// Engagement letter - set to "Approved" when approved by PM
// Costs Disclosure - set to "Approved when signed and submitted by all customers
// Client Authorisation Form - set to "Approved when signed and submitted by all customers
// Contract of Sale becomes approved when *Approve Contract of Sale (Contract stage - Sell) and *Purchase is unconditional (Contract stage - Buy)
// Contract Review becomes approved at *Approve Contract Review stage (This is not the buy/sell workflow, but the contract review workflow itself)
export const updateDocStatus = async ({ role, jobId, doctype }) => {
  try {
    if (role === 'WSADM' && doctype === 'other') {
      const listingId = (await Jobs.findOneAsync(jobId)).listingId

      await Listings.updateAsync(
        { _id: listingId, 'docs.type': doctype },
        { $set: { 'docs.$.status': 'approved' } }
      )
    }
  } catch (e) {
    debug(`Error in updateDocStatus: ${e.message}`)
  }
}

//when task is reopen, reset every reminder
export const resetReminder = async (taskId) => {
  const task = await Tasks.findOneAsync(taskId)
  if (task.reminderPlans) {
    task.reminderPlans.forEach((plan) =>
      plan.nudges.forEach((nudge) => {
        nudge.sentAt = null
        nudge.scheduleTime = DateTime.now()
          .plus({ [nudge.deltaUnit]: nudge.delta })
          .toJSDate()
      })
    )
    await Tasks.updateAsync(taskId, { $set: task })
  }
}

export const shouldTaskAutoComplate = async (taskId) => {
  try {
    const task = await Tasks.findOneAsync(taskId)
    if (task.type !== 'multi' && !task.type !== 'upload') return task

    const job = await Jobs.findOneAsync(task.jobId)
    const { docs } = job

    if (task.type === 'multi') {
      const taskRole = task.role
      const isAllSigned = task.docConfig
        .filter((dc) => dc.action.includes('sign')) //sign or signv2
        .every((dc) => {
          const doc = docs?.find((doc) => doc.type === dc.doctype)

          const signature_url = doc.signatures?.find(
            (sig) => sig.signer_role.includes(taskRole) && task.assignedTo === sig.userId
          )?.signature_url

          if (!signature_url) return false
          return true
        })

      if (isAllSigned) {
        return await taskComplete(taskId)
      }
    }
  } catch (e) {
    console.error(e)
    throw new Meteor.Error('error during checking shouldTaskAutoComplate')
  }
}

export const produceHTML = (messages, timeZone) => {
  const messageBody = messages.map(
    (msg) => ` <tr>
  <td>${DateTime.fromJSDate(msg.createdAt)
    .setZone(timeZone)
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</td>
  <td>${msg.type}</td>
  <td>${msg.to}</td>
  <td>${msg.subject}</td>
  <td>${msg.body}</td>
</tr>`
  )

  const messageHTML = `<h2>TimeZone: ${timeZone}</h2><table><tr><th>Created</th><th>Type</th><th>To</th><th>Subject</th><th>Content</th></tr> ${messageBody.join()}</table>`

  const html = `<html>

<head>
    <title>Message for Listing</title>
    <style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
</head>

<body>
${messageHTML}
</body>
</html>`
  return html
}

export const setTaskStatus = async ({ jobId, slug }) => {
  try {
    const starters = await Tasks.find(
      {
        jobId,
        hidden: { $ne: true },
        depends: { $exists: true, $size: 0 },
      },
      { hint: 'by_jobId' }
    ).fetchAsync()
    await Promise.all(
      starters.map(async (step) => {
        // Log task ready
        logger.info(`Task ${slug}/${step.slug} is ready`)
        await taskReady(step._id)
      })
    )
    // update the job status
    const nextStep = await Tasks.find(
      {
        jobId,
        status: 'ready',
        role: { $in: ['WSADM', 'PART', 'BOSS'] },
      },
      { hint: 'by_jobId_status_role' }
    ).mapAsync((task) => ({
      taskId: task._id,
      name: task.role === 'PART' ? task.customerText : task.name,
    }))

    await Jobs.updateAsync(jobId, { $set: { nextStep } })
  } catch (e) {
    console.error(e)
    debug('setTaskStatus', e)
  }
}

export const taskAction = async (action, id) => {
  const fns = {
    create: taskCreated,
    complete: taskComplete,
    skip: taskSkip,
    skipall: taskSkipall,
    open: taskOpen,
    activate: taskActivate,
    ready: taskReady,
    reopen: taskReopen,
    goto: taskReopen,
    switch: taskSwitch,
    hide: taskHide,
    show: taskShow,
    activateWorkshop: activateWorkshop,
  }
  let res
  if (fns[action] && typeof fns[action] === 'function') {
    res = await fns[action](id)
  } else {
    const message = `Unsupported task action: ${action} requested for task id ${id}`
    logger.error(message)
    res = await Promise.resolve({ status: 'failed', message })
  }
  return res
}
