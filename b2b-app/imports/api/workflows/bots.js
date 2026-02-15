import { Meteor } from 'meteor/meteor'
import { Jobs, Tasks } from '/imports/api/workflows/schema'
import { taskComplete, queueAction, getValues } from './functions'
import { sendTrigger } from '/imports/api/messages/functions'
import Workshops from '/imports/api/workshops/schema'

const debug = require('debug')('app:workflow-task-bots')

const ENTITIES = {
  document: { arr: 'docs', field: 'type' },
  person: { arr: 'persons', field: 'role' },
  job: {},
}

const expressions = [
  /* This one is a document check and action. It's looking for
   * if <type>.<doctype>.<state> <action> <task-slug>
   *   where
   *   - type is the type of object, eg person or document
   *   - doctype is the document type, eg roc, or role (for type=person)
   *   - state is the document state, either exists, present or missing
   *   - action is what you want to do. It will call a Meteor method named `task.${action}`
   *   - task-slug is the slug of the task within this  workflow to act upon
   */
  {
    re: /(before|after|create|update)\s+(if|unless)\s+(\w+)\.(\w+)\.(\w+)\s+(\w+)\s+(\S+)/,
    func: async (
      jobId,
      task,
      job,
      [line, phase, ifunless, type, fld, state, action, taskSlug]
    ) => {
      try {
        const polarity = ifunless === 'if' // Make this a true/false value now
        const taskId = task._id
        debug(
          `Detected in ${task.slug} logic: (${phase}) [if ${type}.${fld}.${state} ${action} ${taskSlug}]`
        )

        const entity = ENTITIES[type]
        if (!entity) {
          throw new Meteor.Error(`Unsupported type: ${type} in expression: ${line}`)
        }
        let doit
        if (entity.arr) {
          const doc = job[entity.arr].find((d) =>
            d[entity.field].match(new RegExp(fld, 'i'))
          )
          doit =
            (doc && ['present', 'exists'].includes(state)) ||
            (!doc && state === 'missing')
        } else {
          // Looking for a job attribute  value
          doit = job[fld] === state
        }

        if (!polarity)
          // If the logic said "unless", we need to negate the 'doit' value
          doit = !doit
        if (doit) {
          if (!Meteor.server.method_handlers[`task.${action}`])
            throw new Meteor.Error(`Method not found: "task.${action}"`)
          else {
            if (taskSlug === 'me') {
              await queueAction(action, task._id, task.slug)
            } else {
              const tasks = await Tasks.find(
                { jobId, slug: taskSlug },
                { hint: 'by_jobId_slug_status' }
              ).fetchAsync()
              for (const t of tasks) {
                // Queue up the acstion...
                await queueAction(action, t._id, taskSlug)
              }
            }
          }
        }
      } catch (e) {
        console.error(e)
        debug('expressions.func', e.message)
      }
    },
  },
]

/*
 * Check for robot tasks that are ready to go.
 */
export const workflowCheckAll = async (when) => {
  // Find all the tasks that are ready to go
  const tasks = await Tasks.find(
    { status: 'ready', role: 'SYS', type: 'bot' },
    { hint: 'by_status_role_type' }
  ).fetchAsync()
  debug(`${tasks.length} workflow tasks are ready to go...`)
  await Promise.all(
    tasks.map(async (task) => {
      if (task.logic) {
        /* Example of logic statements:
         *   if document.roc.missing goto assign-con
         *   if document.cos.signed complete me
         *   if document.roc.present goto read-review
         *   if document.roc.exists skip another-task
         *   if document.roc.exists skipall another-task # - This is a cascading skip
         */
        const job = await Jobs.findOneAsync(task.jobId)
        if (!job) throw new Meteor.Error('Could not find job')
        task.logic.split(/\n/).forEach((line) => {
          let matched
          expressions.forEach((exp) => {
            const m = line.match(exp.re)
            if (m) {
              matched = true
              exp.func(job._id, task, job, m)
            }
          })
          if (!matched) debug(`workflowCheckAll Logic not understood: "${line}"`)
        })
      }
      // TODO: Work out when it's a single task or not
      await taskComplete(task._id, { single: true })
    })
  )
}

/* Check the logic block for lines that begin with the 'when' parameter,
 * being either 'before' or 'after'
 * @param {String} id - Task id
 * @param {String} when - 'before' or 'after'
 */
export const TaskCheckLogic = async (id, when) => {
  debug(`taskCheckLogic ${id} ${when}`)
  const task = await Tasks.findOneAsync(id)
  if (!task) throw new Meteor.Error('Could not find task')
  if (task.logic) {
    const job = await Jobs.findOneAsync(task.jobId)
    if (!job) throw new Meteor.Error('Could not find job')
    task.logic
      .split(/\n/)
      .filter((line) => line.match(new RegExp(`^\s*${when}`)))
      .forEach((line) => {
        let matched
        expressions.forEach((exp) => {
          const m = line.match(exp.re)
          if (m) {
            matched = true
            exp.func(job._id, task, job, m)
          }
        })
        if (!matched) debug(`TaskCheckLogic Logic not understood: "${line}"`)
      })
  }
}

/* Check the logic block for lines that begin with the 'when' parameter,
 * being either 'before' or 'after'
 * @param {String} id - Task id
 * @param {String} when - 'before' or 'after'
 */
export const evaluateLogic = async (id, when) => {
  try {
    const task = await Tasks.findOneAsync(id)
    if (!task) throw new Meteor.Error('Could not find task')
    if (task.logic) {
      debug(`evaluateLogic ${id} ${when} logic=${task.logic}`)
      const job = await Jobs.findOneAsync(task.jobId)
      if (!job) throw new Meteor.Error(`Could not find job with _id ${task.jobId}`)
      task.logic
        .split(/\n/)
        .filter((line) => line.match(new RegExp(`^\s*${when}`)))
        .forEach((line) => {
          let matched
          expressions.forEach((exp) => {
            const m = line.match(exp.re)
            if (m) {
              matched = true
              exp.func(job._id, task, job, m)
            }
          })
          if (!matched) debug(`evaluateLogic Logic not understood: "${line}"`)
        })
    }
  } catch (e) {
    console.error(e)
    debug('evaluateLogic', e.message)
  }
}

export const canSend = async (jobId) => {
  const participant = await Jobs.findOneAsync(jobId)
  if (!participant) {
    debug(`job not found: ${jobId}`)
    return false
  }
  if (
    participant.cms_status === 'S' &&
    participant.workshop &&
    participant.workshop.startdate > new Date()
  )
    return true
  return false
}

export const sendRemind = async () => {
  try {
    const tasks = await Tasks.find(
      {
        status: 'ready',
        reminderPlans: { $exists: true, $ne: [] },
      },
      { hint: 'by_status' }
    ).fetchAsync()

    for (const task of tasks) {
      const job = await Jobs.findOneAsync(task.jobId)
      if (canSend(task.jobId)) {
        let sent = 0

        for (const plan of task.reminderPlans) {
          for (const nudge of plan.nudges) {
            if (!nudge.sentAt && nudge.scheduleTime && nudge.scheduleTime < new Date()) {
              //send current nudge

              const people = job?.persons
                .filter(
                  (person) =>
                    person.role === task.role && person.userId === task.assignedTo
                )
                .map((person) => {
                  return {
                    ...person,
                    _id: person.userId,
                    username: person.email,
                    roles: [person.role],
                  }
                })
              // Put together a data context
              const data = await getValues({ job, task, userId: task.assignedTo })
              data.url = data.q15url // A little hacky
              data.htmlurl = data.htmlq15url // A little hacky
              await sendTrigger({
                slug: nudge.messageSlug,
                jobId: task.jobId,
                people,
                profile: { name: 'System' },
                data,
              })
              //update current nudge
              nudge.sentAt = Date.now()
              sent = sent + 1
            }
          }
        }
        if (sent) {
          await Tasks.updateAsync(task._id, { $set: task })
          debug(`Sent ${sent} reminders`)
        }
      }
    }
  } catch (e) {
    console.error(e)
    debug('sendRemind error', e.message)
  }
}

export const fetchCMS = async () => {
  try {
    await Meteor.callAsync('extractDWMap') // noRetry: true is now part of the ValidatedMethod definition
  } catch (e) {
    console.error(e)
  }
}

export const processCMS = async () => {
  try {
    await Meteor.callAsync('assembleDWMap')
  } catch (e) {
    console.error(e)
    debug('processCMS error', e.message)
  }
}

export const updateCMS = async () => {
  try {
    await Meteor.callAsync('updateTicklerDWMap')
  } catch (e) {
    console.error(e)
    debug('updateCMS error', e.message)
  }
}

export const workshopsAutoActivate = async () => {
  try {
    return await Meteor.callAsync('activate-all')
  } catch (e) {
    console.error(e)
    debug('workshopsAutoActivate error', e.message)
  }
}
