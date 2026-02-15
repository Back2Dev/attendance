import { Meteor } from 'meteor/meteor'
import { Match, check } from 'meteor/check'
import cloneDeep from 'lodash/cloneDeep'
import logger from '/imports/lib/log'
import { isProductionEnvironment } from '/imports/api/utils.js'
import { cleanPhone } from '/imports/api/util.js'

import Workflows, { Jobs, Stages, Tasks } from '/imports/api/workflows/schema'
import {
  CloneTasksSchema,
  JobsSchema,
  PersonsSchema,
} from '/imports/api/workflows/server/schema-def'
import Workshops from '/imports/api/workshops/schema'
import { WorkshopsSchema } from '/imports/api/workshops/server/schema-def'

import templates from '/imports/api/messages/templates'
import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('app:workflows:functions:jobs')

const createTasks = async ({ startStage, skip, leave, jobId, slug, survey }) => {
  // Are we starting at a specific stage?
  if (startStage) {
    // Update all the tasks in other stages and mark them as complete
    let found = false
    const stgIds = (await Stages.find({ jobId }).fetchAsync()).reduce(
      (acc, stg) => {
        if (found) return acc
        if (stg.slug === startStage) {
          found = true
          return acc
        } else {
          acc.push(stg._id)
        }
        return acc
      },

      []
    )
    const n = await Tasks.updateAsync(
      { stageId: { $in: stgIds } },
      { $set: { status: 'complete', completedAt: new Date() } },
      { multi: true }
    )
    debug(`Completed ${n} tasks at start`)
    await setTasksReady({ jobId, wfSlug: slug })
  }
  // Are we skipping any tasks?
  if (skip) {
    const skippers = await Tasks.updateAsync(
      {
        jobId,
        slug: { $in: typeof skip === 'string' ? [skip] : skip },
      },
      { $set: { status: 'skipped', completedAt: new Date() } },
      { multi: true }
    )
    await setTasksReady({ jobId, wfSlug: slug })
  }
  // If we have instructions to only leave certain tasks,
  // then we skip everything else
  if (leave) {
    const skippers = await Tasks.updateAsync(
      {
        jobId,
        slug: { $nin: typeof leave === 'string' ? [leave] : leave },
      },
      { $set: { status: 'complete', completedAt: new Date() } },
      { multi: true }
    )
    await setTasksReady({ jobId, wfSlug: slug })
  }
  if (survey) {
    console.log(`Changing ekit-any to ${survey}`)
    await Tasks.updateAsync(
      { jobId: jobId, type: 'webform', webform: 'ekit-any' },
      { $set: { webform: survey, doctype: survey } }
    )
  }
}

const adminPersons = [
  {
    name: 'Cathy Webb',
    role: 'WSADM',
    email: 'ctwebb@mapconsulting.com',
  },
  {
    name: 'TBA',
    role: 'WSLEAD',
  },
  {
    name: 'Danny Ulrich Duke',
    role: 'EXEC',
    email: 'dud@mapconsulting.com',
  },
]
export const createAJob = async ({ wf, form, slug, options }) => {
  try {
    const wfbits = Object.assign({}, wf)
    delete wfbits._id
    delete wfbits.stages
    let job = Object.assign({}, wfbits, form)
    if (Meteor.settings.env.environment === 'test') {
      adminPersons.forEach((admin) => {
        if (!job.persons?.find((p) => p.role === admin.role)) job.persons?.push(admin)
      })
    }

    if (job.persons) {
      // await Promise.all(
      // job.persons.map(async (person) => {
      for (const person of job.persons) {
        if (person.email) {
          person.email = person.email.toLowerCase()
          const user = await Meteor.users.findOneAsync({
            'emails.address': person.email,
          })
          if (!user) throw new Meteor.Error(404, `User not found: ${person.email}`)
          person.userId = user._id
          person.assignedAt = new Date()
        }
        person.mobile = cleanPhone(person.mobile)
      }
      // )
    }
    if (!job.docs) job.docs = CONSTANTS.MIN_DOCS

    // Validate ahead of insert
    try {
      job.persons[0] = PersonsSchema.clean(job.persons[0])
      // job = JobsSchema.clean(job)
    } catch (e) {
      // debug('verify error', e.message)
      console.error(e)
      throw new Meteor.Error(e.message)
    }
    const jobId = await Jobs.insertAsync(job)
    if (!jobId) throw new Error(`Could not create job`)
    logger.audit(`Launching job ${slug} ${options ? JSON.stringify(options) : ''}`, {
      jobId,
      slug,
      name: job.name,
      userId: Meteor.userId(),
    })
    const ret = await Meteor.callAsync('start.job', slug, job.persons, job)
    if (ret.jobId) {
      await createTasks({ jobId: ret.jobId, ...options })
    }
    logger.audit(`launched job ${slug} ${options ? JSON.stringify(options) : ''}`, {
      jobId,
      slug,
      name: job.name,
      userId: Meteor.userId(),
    })
    return jobId
  } catch (e) {
    debug(e)
  }
}

// Launch participant and workshop jobs
export const launchPWJob = async (form, options) => {
  try {
    check(form, Object)
    check(options, Match.Maybe(Object))
    const user = await Meteor.userAsync()
    if (isProductionEnvironment() && !hasRole(user, 'ADM') && !hasRole(user, 'WSADM')) {
      throw new Meteor.Error('Permission denied (launch PW job)')
    }
    // Create the participant workflow first
    const { startStage, skip, leave } = options || {}
    const {
      slug,
      workshop: { slug: wSlug },
    } = form
    // Check that both workflow templates are available
    // Participant workflow
    const partWf = await Workflows.findOneAsync({ slug })
    // Workshop workflow
    const wsWf = await Workflows.findOneAsync({ slug: wSlug })
    if (!partWf || !wsWf) {
      logger.error(`Could not find workflow(s) [${slug},${wSlug}]`, { data: form })
      return { status: 'failed', message: `Could not find workflow [${slug},${wSlug}]` }
    }
    // Assign the same people to the workshop
    const { workshop } = cloneDeep(form)
    workshop.persons = cloneDeep(form.persons)
    workshop.wsdate = new Date()
    workshop.wsdate.setDate(workshop.wsdate.getDate() + 30)
    workshop.startdate = workshop.wsdate
    const wJobId = await createAJob({
      wf: wsWf,
      form: workshop,
      slug: wSlug,
      options,
    })
    form.workshop.workshopId = wJobId
    const pJobId = await createAJob({ wf: partWf, form, slug, options })

    return { status: 'success', participantJobId: pJobId, workshopJobId: wJobId }
  } catch (e) {
    logger.error(`Error: ${e.message}`, { message: e.message, data: form })
    debug(e.stack)
    return { status: 'failed', message: e.message }
  }
}

// Launch empty workshop job
export const launchEmptyJob = async (form, options) => {
  try {
    check(form, Object)
    check(options, Match.Maybe(Object))
    const user = await Meteor.userAsync()
    if (isProductionEnvironment() && !hasRole(user, 'ADM') && !hasRole(user, 'WSADM')) {
      throw new Meteor.Error('Permission denied (launch W0 job)')
    }
    // Create the participant workflow first
    const { startStage, skip, leave } = options || {}

    const { slug: wSlug } = form
    // Check that  workflow templates are available
    // Workshop workflow
    const wsWf = await Workflows.findOneAsync({ slug: wSlug })
    if (!wsWf) {
      logger.error(`Could not find workflow(s) [${wSlug}]`, { data: form })
      return { status: 'failed', message: `Could not find workflow [${wSlug}]` }
    }
    // Assign the same people to the workshop
    const workshop = form
    workshop.wsdate = new Date()
    workshop.wsdate.setDate(workshop.wsdate.getDate() + 30)
    workshop.startdate = workshop.wsdate
    workshop.persons = []
    const wJobId = await createAJob({
      wf: wsWf,
      form: workshop,
      slug: wSlug,
      options,
    })

    return { status: 'success', workshopJobId: wJobId }
  } catch (e) {
    logger.error(`Error: ${e.message}`, { message: e.message, data: form })
    debug(e.stack)
    return { status: 'failed', message: e.message }
  }
}

// Launch participant and workshop jobs
export const launchBeatlesJob = async ({ workshop, participants }, options) => {
  try {
    check(workshop, Object)
    check(participants, Array)
    check(options, Match.Maybe(Object))
    const user = await Meteor.userAsync()
    if (isProductionEnvironment() && !hasRole(user, 'ADM') && !hasRole(user, 'WSADM')) {
      throw new Meteor.Error('Permission denied (launch PW job)')
    }
    // Create the participant workflow first
    // Check that both workflow templates are available
    // Participant workflow
    let slug = participants[0].slug
    const partWf = await Workflows.findOneAsync({ slug })
    if (options.addTask) partWf.stages[0].steps.push(options.addTask)
    const taskSlug = (options.doctype || options.survey)?.replace(/ekit-/, '')
    if (taskSlug) {
      // Make changes to a temp copy
      slug = partWf.slug = partWf.slug + '-temp'
      partWf.stages.forEach((stg) => {
        stg.steps.forEach((step) => {
          if (step.slug === 'any-survey') {
            step.name = taskSlug
            step.slug = taskSlug
            step.doctype = options.doctype || options.survey
            step.webform = options.survey
          }
        })
      })
    }
    delete partWf._id
    const n = await Workflows.upsertAsync({ slug: partWf.slug }, { $set: { ...partWf } })

    // Workshop workflow
    const wsWf = await Workflows.findOneAsync({ slug: workshop.slug })
    if (!partWf || !wsWf) {
      logger.error(`Could not find workflow(s) [${slug},${workshop.slug}]`, {
        data: workshop,
      })
      return {
        status: 'failed',
        message: `Could not find workflow [${slug},${workshop.slug}]`,
      }
    }
    workshop.jobType = 'workshop'
    workshop.identifier = workshop.workshop_id
    workshop.name = `${workshop.hotel_id} ${workshop.dates}`
    const wsCopy = cloneDeep(workshop) // Clone before mutating
    // Assign the people to the workshop
    workshop.persons = participants
      .map((p) => {
        return cloneDeep(p.persons)
      })
      .flat()
      .reduce((acc, p) => {
        if (!acc.find((person) => person.email === p.email)) acc.push(p)
        return acc
      }, [])
    // Create the workshop
    workshop.startdate = new Date()
    workshop.startdate.setDate(workshop.startdate.getDate() + 30)

    const wJobId = await createAJob({
      wf: wsWf,
      form: workshop,
      slug: workshop.slug,
      options,
    })
    // Create the participants
    wsCopy.workshopId = wJobId
    for (const p of participants) {
      p.slug = slug
      p.workshop = wsCopy
      p.workshopId = wJobId
      p.workshop.workshopType = workshop.workshopType
      p.workshop.type = workshop.type
      p.workshop.wsdate = workshop.startdate

      p.identifier = p.cms_id
      p.jobType = 'participant'
      p.persons.forEach((person) => {
        if (person.role === 'PART') partWf.name = person.name
      })
      await createAJob({ wf: partWf, form: p, slug: p.slug, options })
    }
    return { status: 'success', workshopJobId: wJobId }
  } catch (e) {
    logger.error(`Error: ${e.message}`, { message: e.message })
    debug(e.stack)
    return { status: 'failed', message: e.message }
  }
}

export const getJob = async (taskId) => {
  try {
    const task = await Tasks.findOneAsync({ _id: taskId })
    if (!task) throw new Error('Could not find task ' + taskId)
    const job = await Jobs.findOneAsync({ _id: task?.jobId })
    if (!job) throw new Error('Could not find job ' + task?.jobId)
    return { job, task }
  } catch (e) {
    console.warn(e.message)
  }
}

export const cloneTask = async ({ jobId, slug, props, _id = null, config }) => {
  try {
    check(jobId, String)
    check(slug, String)
    check(props, Object)

    const job = await Jobs.findOneAsync({ _id: jobId })
    if (!job) return { status: 'failed', message: `Could not find job with id ${jobId}` }

    let [srcTask] = await Tasks.find(
      { jobId, slug },
      { sort: { assignedTo: -1 } } // This should find one that's unassigned (if any)
    ).fetchAsync()
    if (!srcTask) {
      // Try to find the <slug> in the workflow definition
      const wf = await Workflows.findOneAsync({ slug: job.slug }) // WAS job.wfSlug
      if (wf) {
        const steps = wf.stages
          .map((stg) => {
            stg.steps.forEach((step) => (step.stageSlug = stg.slug))
            return stg.steps
          })
          .flat()
        srcTask = steps?.find((step) => step.slug === slug)
        if (srcTask) {
          srcTask.jobId = jobId
          const stg = await Stages.findOneAsync({ jobId, slug: srcTask.stageSlug })
          srcTask.stageId = stg?._id
          srcTask.sortOrder = 207
        }
      }
      if (!srcTask)
        return {
          status: 'failed',
          message: `Could not find existing task with slug ${slug} to clone`,
        }
    }
    let keepId = !srcTask.assignedTo ? srcTask._id : null
    // debug({ _id: srcTask._id, assignedTo: srcTask.assignedTo })
    const existing = CloneTasksSchema.clean(srcTask, { filter: true })
    const newTask = { ...existing, ...props }
    if (config) newTask.config = config // Should be an object
    if (keepId && !_id) {
      newTask.status = 'blocked'
      // debug({ action: 'updating', props })
      if (config) props.config = config
      const n = await Tasks.updateAsync({ _id: keepId }, { $set: props }) // set config as well?
      // debug({
      //   action: `updated ${n} ${keepId}`,
      // })
      if (n) return await new Promise((resolve) => setTimeout(resolve, 0, keepId))
      throw new Error(`Could not update existing task ${slug}`)
    } else {
      newTask._id = _id
      const id = await Tasks.insertAsync(newTask)
      console.log({ id, _id })
      return id
    }
  } catch (e) {
    console.error(e)
    return { status: 'failed', message: e.message }
  }
}
