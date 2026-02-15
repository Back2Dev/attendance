import { Meteor } from 'meteor/meteor'
import { Match, check } from 'meteor/check'
import { Roles } from 'meteor/alanning:roles'

import logger from '/imports/lib/log'
import { trimObj } from '/imports/api/utils'
import Workflows, { Jobs, Tasks, Stages } from '/imports/api/workflows/schema'
import {
  taskReady,
  taskBotCheck,
  taskCreated,
  setNextWorkflowType,
  updateJob,
  updateDocStatus,
  setTaskStatus,
} from './functions'
import { push } from '/imports/api/notifications/server/helper.js'
import CONSTANTS from '/imports/api/constants'
import { hasRole } from '/imports/api/users/utils'
import { checkTaskPermission, authenticationCheck, checkJobPermission } from './utils'
import {
  checkUpdateJobPermission,
  pushUserJobUpdates,
} from '/imports/api/workflows/utils'
import Profiles from '/imports/api/profiles/schema'
import { sendTrigger } from '/imports/api/messages/functions'

const debug = require('debug')('app:workflows')

const getRoleMap = (people) => {
  return people.reduce((prev, p, ix) => {
    const { name, userId, primary } = p
    if (p.role === 'PART') {
      if (primary) prev[p.role] = { name, userId }
    } else prev[p.role] = { name, userId }
    return prev
  }, {})
}

const getInitials = (name) => {
  if (!name) return '??'
  const names = name.split(/[\s,]+/)
  if (names.length < 2) return name //'??'
  return names[0]
  // return `${names[0][0]}${names[names.length - 1][0]}`
}

Meteor.methods({
  'update.tasks': async (form) => {
    try {
      check(form, Object)
      await checkTaskPermission({ id: form._id }, 'update')
      const { log, role, jobId } = form
      delete form.log
      const id = form._id
      delete form._id
      const n = await Tasks.updateAsync(id, { $set: form })

      if (log && jobId && role) {
        await updateDocStatus({ role, jobId, doctype: log.doctype })

        logger.audit(`Doc-type: ${log.doctype} is ${log.action}ed`, {
          taskId: log.taskId,
        })
      }

      return { status: 'success', message: `Updated ${n} task(s)` }
    } catch (e) {
      logger.error(`Error updating task: ${e.message}`, {
        message: e.message,
        data: form,
      })
      return { status: 'failed', message: `Error updating task: ${e.message}` }
    }
  },
  'start.job': async (slug, people = [], jobData = {}) => {
    try {
      // authenticationCheck()
      // REVISIT: Starting a job isn't necessarily restricted
      // if (!hasRole(Meteor.user(), 'ADM') && !hasRole(Meteor.user(), 'PM')) {
      //   throw new Meteor.Error('Permission denied (start.job)')
      // }
      const wf = await Workflows.findOneAsync({ slug })
      if (!wf) {
        logger.error(`No workflow found for ${slug}.`)
        return { status: 'failed', message: `Could not find a workflow called ${slug}` }
      }

      delete wf._id
      // Find the primary customer and set it - Assume it's the first one :)
      const primo = people.find((p) => p.role === 'PART')
      if (primo) primo.primary = true
      const roleMap = getRoleMap(people)
      // Start writing to DB now
      const jobId = jobData._id
      await Promise.all(
        wf.stages.map(async (stg, iy) => {
          stg.jobId = jobId
          stg.sortOrder = iy + 1
          const steps = stg.steps
          const stageId = await Stages.insertAsync(stg)
          await Promise.all(
            steps.map(async (task, ix) => {
              task.jobId = jobId
              task.stageId = stageId
              task.sortOrder = (iy + 1) * 100 + ix + 1
              // Now assign people to it
              if (roleMap[task.role]) {
                const who = roleMap[task.role]
                task.assignedTo = who.userId
                task.responsible = who.name
              }
              task._id = await Tasks.insertAsync(task)
              await taskCreated(task._id)
            })
          )
        })
      )

      await setTaskStatus({ jobId, slug })

      logger.audit('Job launch complete', {
        jobId,
        slug,
        people: people.map((p) => p.name),
      })
      return { status: 'success', jobId }
    } catch (e) {
      console.error(e)
      logger.error(`Error in start.job: ${e.message}`, {
        message: e.message,
        data: { slug, people },
      })
      return { status: 'failed', message: e.message }
    }
  },

  // This one is a special for testing purposes...
  'launch.job': async (form, options) => {
    throw new Meteor.Error(
      'method launch.job is deprecated, look at launch.participant.job or launch.workshop.job'
    )
  },
  // See also update.webform in methods.forms
  // This one is legacy, and can go at some point
  'update.webdata': async ({ jobId, doctype, form }) => {
    check(jobId, String)
    check(doctype, String)
    check(form, Object)
    await authenticationCheck()
    const trimmedForm = trimObj(form)
    const job = await Jobs.findOneAsync(jobId)
    if (!job) logger.warn('Job not found', { jobId, doctype, trimmedForm })
    else {
      await checkUpdateJobPermission(job)
      const ix = job.docs.findIndex((doc) => doc.type === doctype)
      if (ix !== -1) {
        await Jobs.updateAsync(jobId, {
          $set: { [`docs.${ix}.formData`]: trimmedForm },
        })
      }
    }
  },
  'get.job.deps': async (jobId, statii) => {
    try {
      const job = await Jobs.findOneAsync(jobId)
      if (!job) throw new Meteor.Error('Could not find job ' + jobId)
      const stages = await Stages.find(
        { jobId: job._id },
        { sort: { sortOrder: 1 } }
      ).mapAsync((stage) => stage)
      let steps = []
      for (const stage of stages) {
        steps = steps.concat(
          await Tasks.find(
            { stageId: stage._id },
            { sort: { sortOrder: 1 } },
            { hint: 'by_stageId_sortOrder' }
          ).mapAsync((task) => task)
        )
      }
      const num = steps.reduce((acc, t) => {
        acc[t.slug] = acc[t.slug] ? acc[t.slug] + 1 : 1
        return acc
      }, {})
      // Rename the task slugs, and rewire
      Object.keys(num).forEach((slug) => {
        if (num[slug] > 1) {
          // Find the steps that depend on this one:
          steps
            .filter((s) => s.depends.filter((dep) => dep.id === slug).length)
            .filter((s) => s.slug !== slug)
            .forEach((s) => {
              for (let ix = 0; ix < num[slug]; ix++) {
                // debug(`${s.slug} depends on cloned task: ${slug}-${ix + 1}`)
                s.depends.push({ id: `${slug}-${ix + 1}`, name: `${slug} (${ix + 1})` })
              }
            })
        }
      })
      // Rename the original slugs now
      Object.keys(num).forEach((slug) => {
        if (num[slug] > 1) {
          steps
            .filter((s) => s.slug === slug)
            .forEach((s, ix) => {
              s.slug = `${s.slug}-${ix + 1}`
            })
        }
      })
      //
      const counts = Object.keys(CONSTANTS.STEP_STATUS).reduce((acc, s) => {
        acc[s] = 0
        return acc
      }, {})
      steps.forEach((step) => {
        counts[step.status] = counts[step.status] + 1
      })
      const nodes = steps
        ? steps
            .filter((step) => !statii || statii.includes(step.status))
            .map((step) => {
              step.initials = getInitials(step.responsible)
              const role = `${step.role} (${step.initials})`
              // step.role === 'PART' ? `${step.role} (${step.initials})` : step.role
              return {
                slug: step.slug,
                label: `${role}: ${step.slug}`,
                title: `${step.responsible}: ${step.name}`,
                status: step.hidden ? 'hidden' : step.status,
              }
            })
        : []
      const links = steps
        ? steps
            .filter((step) => !statii || statii.includes(step.status))
            .filter((step) => step.depends)
            .map((step) => {
              return step.depends
                .map((dep) =>
                  nodes.find((node) => node.slug === dep.id)
                    ? { from: dep.id, to: step.slug }
                    : null
                )
                .filter((link) => link)
            })
            .flat()
        : []
      // debug(nodes, links)
      return { links, nodes, counts }
    } catch (e) {
      debug(`Error ${e.message} encountered in get.job.deps`)
      return { status: 'failed', message: e.message, links: [], nodes: [], counts: {} }
    }
  },

  // different to start.job as we update the job
  'start.job.update': async (job) => {
    try {
      debug('starting job...')
      check(job, Object)
      await authenticationCheck()
      // REVISIT - Starting a job can be done by all playas
      const user = await Meteor.userAsync()
      if (
        !(await hasRole(user, 'ADM')) &&
        !(await hasRole(user, 'PM')) &&
        !(await hasRole(user, 'PART')) &&
        !(await hasRole(user, 'WSADM'))
      ) {
        throw new Meteor.Error('Permission denied (start.job.update)')
      }
      job = await setNextWorkflowType(job, true)
      // const slug = job.wfSlug // Not applicable, wfSlug is gone
      const people = job.persons
      let jobId = job._id
      const wf = await Workflows.findOneAsync({ slug })
      if (!wf) {
        const message = `Could not find a workflow called ${slug}`
        return { status: 'failed', message }
      }
      const job = await Jobs.findOneAsync({ jobId }, { hint: 'by_jobId' })
      if (job) {
        logger.info(`Job is launched already`)
        return { status: 'failed', message: `job is launched already` }
      }
      delete wf._id
      // Find the primary customer and set it - Assume it's the first one :)
      const primo = people.find((p) => p.role === 'PART')
      if (primo) primo.primary = true
      const roleMap = getRoleMap(people)
      // Start writing to DB now
      //
      // const jobId = await Jobs.insertAsync(Object.assign({ persons: people }, wf))
      await Promise.all(
        wf.stages.map(async (stg, iy) => {
          stg.jobId = jobId
          stg.sortOrder = iy + 1
          const steps = stg.steps
          const stageId = await Stages.insertAsync(stg)
          await Promise.all(
            steps.map(async (task, ix) => {
              task.jobId = jobId
              task.stageId = stageId
              task.sortOrder = (iy + 1) * 100 + ix + 1
              if (roleMap[task.role]) {
                const who = roleMap[task.role]
                task.assignedTo = who.userId
                task.responsible = who.name
              }
              // task.status = 'blocked' // This is a default in the schema, not needed here
              const taskId = await Tasks.insertAsync(task)
              await taskCreated(taskId)
            })
          )
        })
      )
      // Set the first task to ready
      const starters = await Tasks.find(
        {
          jobId,
          hidden: { $ne: true },
          depends: { $exists: true, $size: 0 },
        },
        { hint: 'by_jobId_status_depends' }
      ).fetchAsync()
      await Promise.all(
        starters.map(async (step) => {
          // Log task ready
          logger.info(`Task ${slug}/${step.slug} is ready`)
          await taskReady(step._id)
        })
      )
      // update the job
      await Jobs.updateAsync({ _id: jobId }, { $set: { ...job, status: 'active' } })
      // the calculate the nextStep for the job
      const nextStep = await Tasks.find(
        {
          jobId,
          status: 'ready',
          role: { $in: ['WSADM', 'PART', 'PM'] },
        },
        { hint: 'by_jobId_status_role' }
      ).mapAsync((task) => ({
        taskId: task._id,
        name: task.role === 'PART' ? task.customerText : task.name,
      }))
      await Jobs.updateAsync(jobId, { $set: { nextStep } })
      // notify the conveyancer they have been assigned
      const conveyancer = people.find((person) => {
        return person.role === 'WSADM'
      })

      if (conveyancer) {
        const { userId } = conveyancer
        //inform conveyancer
        const users = await Meteor.users
          .find({ _id: userId }, { fields: { _id: 1, emails: 1, username: 1 } })
          .fetchAsync()
        const people = await Promise.all(
          users.map(async (person) => {
            person.roles = await Roles.getRolesForUserAsync(person)
            person.mobile = (await Profiles.findOneAsync({ userId: person._id }))?.mobile
            return person
          })
        )
        const res = await sendTrigger({
          jobId: jobId,
          slug: 'assign-con',
          people: people,
        })
        if (res?.status === 'failed') {
          return res
        }

        // update the Updates collection
        await pushUserJobUpdates({ jobId, userId })

        await push({
          userId: (await Meteor.users.findOneAsync({ _id: userId }))?._id,
          type: 'assignment',
          message: `You have been assigned to property: ${job.address}`,
          data: {
            job: {
              jobId: jobId,
            },
          },
          // TODO: add a url to job details page here
        })
      }
      logger.audit('Created job', { jobId, data: { jobId, slug } })
      return { status: 'success', jobId }
    } catch (e) {
      console.error(e)
      logger.error(`Error in start.job.update: ${e.message}`, {
        message: e.message,
        data: job,
      })
      return { status: 'failed', message: e.message }
    }
  },
  'special.tasks.skip': async (address, skip) => {
    try {
      await authenticationCheck()
      const skippers = typeof skip === 'string' ? [skip] : skip
      logger.audit(`Skipping ${skippers} tasks`, { address, skippers })
      const job = await Jobs.findOneAsync(
        { address, status: 'active' },
        { hint: 'by_address' }
      )
      if (!job) debug('Could mot find job')
      else {
        const job = await Jobs.findOneAsync({ jobId: job?._id }, { hint: 'by_jobId' })
        const jobId = job?._id || 'xxx'
        // Are we skipping any tasks?
        if (skip) {
          await checkJobPermission({ id: jobId }, 'update')
          const updateQuery = {
            jobId,
            slug: { $in: skippers },
            status: { $in: ['ready', 'blocked'] },
          }
          const nSkip = await Tasks.updateAsync(
            updateQuery,
            { $set: { status: 'skipped', completedAt: new Date() } },
            { multi: true }
          )
          // Make the next tasks ready
          const readyQuery = {
            jobId,
            'depends.id': { $in: skippers },
            slug: { $nin: skippers },
          }
          const nReady = await Tasks.updateAsync(
            readyQuery,
            { $set: { status: 'ready', readyAt: new Date() } },
            { multi: true }
          )
          debug(`Skipped ${nSkip}, readied: ${nReady}`, { updateQuery, readyQuery })
          const tasks = await Tasks.find({ jobId }, { hint: 'by_jobId' }).fetchAsync()
          await updateJob(tasks[0]._id)
        }
      }
    } catch (e) {
      logger.error(`Error in  special.tasks.skip: ${e.message}`, {
        data: { address, skip },
      })
      return { status: 'failed', message: e.message }
    }
  },
  'manual.bot.check': async () => {
    // authenticationCheck()
    // if (!hasRole(Meteor.user(), 'ADM') && !hasRole(Meteor.user(), 'PM')) {
    //   throw new Meteor.Error('Permission denied (manual.bot.check)')
    // }
    await taskBotCheck()
  },
  async 'workflows.isTaskReady'(taskId) {
    if (!Match.test(taskId, String)) {
      return {
        ready: false,
      }
    }
    // find the task
    const task = await Tasks.findOneAsync({ _id: taskId })
    if (!task) {
      return {
        ready: false,
      }
    }
    if (task.status === 'ready') {
      return {
        ready: true,
      }
    }
    // find the job
    const job = await Jobs.findOneAsync({ _id: task.jobId })
    return {
      ready: false,
      jobId: job?._id,
      jobId: job?.jobId,
    }
  },
  'test.uses.schema': async () => {
    const jobsCollection = Mongo.Collection.get('participants')
    const res = await jobsCollection.insertAsync({ test: '101' })
    debug({ res })
  },
  'insert.stages': async (form) => {
    try {
      check(form, Object)
      await authenticationCheck()
      // checkJobPermission()
      const bypass = form.createdAt ? { getAutoValues: false } : {}
      const id = await Stages.insertAsync(form, bypass)
      // logger.info('Inserted stage ' + form.slug)
      return { status: 'success', message: 'Added stage', id }
    } catch (e) {
      logger.error(`Error adding stage: ${e.message}`, {
        message: e.message,
        data: form,
      })
      return { status: 'failed', message: `Error adding stage: ${e.message} ` }
    }
  },
  'insert.tasks': async (form) => {
    try {
      check(form, Object)
      await authenticationCheck()
      // checkJobPermission()
      const bypass = form.createdAt ? { getAutoValues: false } : {}
      const id = await Tasks.insertAsync(form, bypass)
      // logger.info('Inserted task ' + form.slug)
      return { status: 'success', message: 'Added task', id }
    } catch (e) {
      logger.error(`Error adding task: ${e.message}`, {
        message: e.message,
        data: form,
      })
      return { status: 'failed', message: `Error adding task: ${e.message} ` }
    }
  },
  //this is for script: copy-job.js
  'insert.jobs': async (form) => {
    try {
      check(form, Object)
      await authenticationCheck()
      // checkJobPermission()
      const bypass = form.createdAt ? { getAutoValues: false } : {}
      const id = await Jobs.insertAsync(form, bypass)
      // logger.info('Inserted job ' + form.slug)
      return { status: 'success', message: 'Added job', id }
    } catch (e) {
      console.error(e)
      return { status: 'failed', message: e.message }
    }
  },
})
