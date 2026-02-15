import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Workflows, { Jobs, Stages, Tasks } from '../schema'
import Profiles from '/imports/api/profiles/schema'
import Surveys from '/imports/api/surveys/schema'
import Responses from '/imports/api/responses/schema'
import DocTypes from '/imports/api/doc-types/schema'
import Settings from '/imports/api/settings/schema'
import Messages from '/imports/api/messages/schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { getUserRoles } from '/imports/api/users/utils'
import { canDo } from '/imports/api/utils/access-control'
import logger from '/imports/lib/log'
import './methods-copy'
import '../methods-plus'
import '../methods.export'
import '../methods.tasks'
import '../methods.custom'
import '../methods.jobs'
import '../methods.forms'
import { populateDoc } from '/imports/api/util'
const debug = require('debug')('app:workflows-pubs')
import Participants from '/imports/api/participants/schema'

Meteor.publish('all.workflows.messages', () => {
  return [Workflows.find({}), MessageTemplates.find({})]
})

Meteor.publish('id.task.webform', async function (token) {
  // debug('id.task.webform ' + token)
  try {
    const task = await Tasks.findOneAsync(token)
    let slug = token
    let job, survey
    if (!task) {
      const response = await Responses.findOneAsync({ _id: token })
      if (!response || !response.surveyId) {
        this.ready()
        console.log(`task or response ${token} not found`)
        return
      }
      survey = await Surveys.findOneAsync(response.surveyId)
      if (!survey) {
        this.ready()
        console.log(`survey for response ${token} not found`)
        return
      }
      slug = survey.slug
    } else {
      if (['blocked'].includes(task.status))
        throw new Meteor.Error('This action is not ready for you to do yet')
      slug = task.webform ? task.webform : task.doctype
      survey = await Surveys.findOneAsync({ slug, active: true })
      if (!survey) throw new Meteor.Error(`survey ${slug} for task ${token} not found`)
      job = await Jobs.findOneAsync({ _id: task.jobId })
      if (!job) throw new Meteor.Error(`job ${task.jobId} not found`)
    }
    // check for permissions (but allow anonymous users thru)
    if (task && this.userId) {
      const myRoles = await getUserRoles(this.userId)
      if (!canDo({ op: 'readAny', role: myRoles, resource: 'job' })) {
        if (
          !canDo({
            op: 'readOwn',
            role: myRoles,
            resource: 'job',
            log: 'id.task.webform',
          })
        ) {
          throw new Meteor.Error('Permission denied')
        }

        const involved = job.persons.some((p) => p.userId === this.userId)
        if (!involved) {
          logger.info('canNotDo: id.task.webform', { role: myRoles, resource: 'job' })
          throw new Meteor.Error('Permission denied (2p)')
        }
      }
    }
    // TODO: Need to cope with other states
    let webDoc
    if (task) {
      webDoc = job?.docs.find(
        (doc) => doc.type === task.doctype && doc.taskIds?.includes(task._id)
      )

      // // TODO: We may need to remove this fallback later
      // if (!webDoc && task.doctype !== 'ekit-q10') {
      //   // fallback to old way
      //   webDoc = job?.docs.find((doc) => doc.type === task.doctype)
      // }
    }
    const canPopulate = !webDoc //|| !webDoc.populated
    if (canPopulate && job) {
      const survey = await Surveys.findOneAsync({ slug, active: true })
      if (!survey) throw new Meteor.Error(`Survey not found for ${task.doctype}`)
      // Is there a list of instructions on how to pre-populate the document
      if (survey.populate) {
        // Create a webform record, and push a document onto the stack
        webDoc = populateDoc({ job, task }, survey.populate, task.doctype)
      } else {
        let formData = {}

        webDoc = {
          type: task.doctype,
          formData,
        }
      }
      const signatures = []
      if (survey.signatures) {
        Object.keys(survey.signatures).map((role) => {
          job.persons
            .filter((person) => person.role === role)
            .map((person, n) => {
              if (n + 1 > survey.signatures[role]) {
                return
              }
              return signatures.push({
                userId: person.userId,
                name: person.name,
                signer_role: `${role}${n + 1}`,
              })
            })
        })
      }
      webDoc.surveyId = survey._id
      webDoc.docName = `${task.doctype}.pdf`
      webDoc.formStatus = 'progress'
      webDoc.taskIds = task ? [task._id] : []
      webDoc.who = Meteor.userId() || task?.assignedTo
      webDoc.signatures = signatures
      webDoc.notes = []

      debug('Adding document', task.jobId, webDoc)
      await Jobs.updateAsync(task.jobId, { $push: { docs: webDoc } })
    }
    if (survey.actions && survey.actions.preMethod) {
      // Just pass the task id, assume the method knows what to look for
      const res = await Meteor.callAsync(survey.actions.preMethod, {
        taskId: token,
      })
      if (res.status !== 'success') throw new Error(res.message)
      // console.log({ res })
    }

    return [
      Settings.find({ public: true }),
      Tasks.find({ _id: token }),
      Surveys.find({ slug, active: true }),
      Jobs.find({ _id: task?.jobId }),
      Responses.find({ _id: token }),
      Profiles.find(
        { userId: Meteor.userId() },
        { fields: { _id: 1, name: 1, signature: 1, userId: 1, ignorePreview: 1 } }
      ),
      PdfTemplates.find({ docType: task?.webform || task?.doctype }),
    ]
  } catch (e) {
    console.error(e)
    this.added('tasks', token, { error: e.message })
    this.ready()
    return // No need to return anything, as we have provided some data (with this.added)
  }
})

Meteor.publish('jobs.all', async function (query) {
  if (!this.userId) {
    return this.ready()
  }

  if (!Match.test(query.status, Match.Maybe(String))) {
    return this.ready()
  }

  const myRoles = await getUserRoles(this.userId)
  if (!canDo({ op: 'readAny', role: myRoles, resource: 'job' })) {
    return this.ready()
  }

  // TODO: We have performance issue here
  return [
    Jobs.find(
      { status: query.status },
      {
        // fields: { progress: 1, status: 1, name: 1, nextStep: 1, counts: 1 ,roleCounts:1},
        // hint: 'by_listingId',
      }
    ),
  ]
})

/**
 * @deprecated using methods instead
 * Special publication for script: copy-job.mjs
 * This is an expensive publication, and would be better done
 * with method calls to reduce the load on the server
 */
Meteor.publish(
  'jobs.byId',
  async function (id, allStatus, allFields, completedBy = false) {
    throw new Meteor.Error('This publication is deprecated, please use methods instead')
  }
)

/**
 * This is a simple publication for a job
 */
Meteor.publish('id.jobs', async function (id) {
  if (!this.userId) {
    throw new Meteor.Error('Permission denied')
  }

  // TODO: check permission

  try {
    const job = (await Jobs.findOneAsync({ _id: id })) || {}
    const jobId = job?._id || 'unknOwnJOB00'
    let jobIds = [jobId]
    const mtSlugs = (
      await Tasks.find({
        jobId: { $in: jobIds },
      }).fetchAsync()
    )
      .map((t) => t.notifications?.map((n) => n.text))
      .flat()

    return [
      Jobs.find({ _id: { $in: jobIds } }),
      Tasks.find({
        jobId: { $in: jobIds },
      }),
      Stages.find({ jobId: { $in: jobIds } }),
      MessageTemplates.find({ slug: { $in: mtSlugs } }),
      Surveys.find({}),
      Messages.find({
        $or: [
          { jobId: { $in: jobIds } },
          //  { recipientId: { $in: persons } }
        ],
      }),
    ]
  } catch (e) {
    console.error(`Error in id.jobs: ${e.message}`)
    return this.ready()
  }
})

/**
 * publish a listing related to current user
 */
Meteor.publish('my.job.byId', async function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  if (!this.userId) {
    return this.ready()
  }

  const myRoles = await getUserRoles(this.userId)
  // console.log('myRoles', myRoles)
  const job = await Jobs.findOneAsync(id)
  if (!job) return this.ready()

  let query

  if (canDo({ op: 'readOwn', role: myRoles, resource: 'job' })) {
    query = {
      _id: id,
      'persons.userId': this.userId,
    }
  }

  if (canDo({ op: 'readAny', role: myRoles, resource: 'job' })) {
    query = { _id: id }
  }

  if (!query) {
    logger.info('canNotDo: my.listing.byId', { role: myRoles, resource: 'job' })
    return this.ready()
  }

  console.log('query', query)

  return [
    Jobs.find(query, {
      fields: {
        docs: 1,
        name: 1,
        persons: 1,
      },
    }),
    DocTypes.find({}),
    // TODO: Expensive query
    Profiles.find({}, { fields: { userId: 1, signature: 1 } }),
    Tasks.find({ jobId: job?._id, status: { $in: ['complete', 'ready'] } }),
  ]
})
