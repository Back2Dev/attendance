import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { ValidatedMethod } from 'meteor/back2dev:validated-method'
import { Roles } from 'meteor/alanning:roles'

import { getMyRoles } from '/imports/api/users/utils.js'
import { canDo } from '/imports/api/utils/access-control'
import { Jobs, Stages, Tasks } from '/imports/api/workflows/schema'
import logger from '/imports/lib/log'
import {
  checkReadJobPermission,
  checkUpdateOwnJobPermission,
  getJobAddress,
  getPerson,
  replacePersonOnJob,
} from '/imports/api/workflows/utils'
import Profiles from '/imports/api/profiles/schema'
import CONSTANTS from '/imports/api/constants.js'
import { getProfile } from '/imports/api/profiles/functions.js'
import {
  produceHTML,
  taskReplacePersonByRole,
  updateJob,
} from '/imports/api/workflows/functions.js'
import { sendTrigger } from '/imports/api/messages/functions'
import { downloadFile } from '/imports/api/s3-utils.js'
import Messages from '/imports/api/messages/schema'

const debug = require('debug')('app:workflows-methods-jobs')

/**
 * Admin remove the job
 */
export const rmJob = new ValidatedMethod({
  name: 'rm.job',
  schema: {
    id: String,
    reason: String,
  },
  async validate(...args) {
    debug('validate args', args)

    if (!Meteor.userId()) {
      return { status: 'failed', message: 'Please login' }
    }
    const user = await Meteor.userAsync()
    if (!user) {
      return { status: 'failed', message: 'Please login ' }
    }
    // check the permission
    const myRoles = await getMyRoles()
    if (!canDo({ op: 'deleteAny', role: myRoles, resource: 'job', log: 'rm.jobs' })) {
      return {
        status: 'failed',
        message: 'Permission denied',
      }
    }
  },

  /**
   * @param {Object} param0 - job id
   * @param {string} param0._id
   * @param {string} param0.reason
   * @returns {Object} result
   * - {string} result.status - success or failed
   * - {string} result.message
   */
  async run({ id, reason }) {
    try {
      const job = await Jobs.findOneAsync(id)
      const jobId = job?._id
      let n = 0
      if (jobId) {
        n = n + (await Stages.removeAsync({ jobId: jobId }))
        n = n + (await Tasks.removeAsync({ jobId: jobId }))
        n = n + (await Jobs.removeAsync(jobId))
        n = n + (await Messages.removeAsync({ jobId }))
      }
      logger.audit(`Removed job ${getJobAddress(job) || 'N/A'}`, {
        id,
        reason: `${reason} (${n} objects)`,
      })
      return { status: 'success', message: 'Removed job' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing job: ${e.message}`,
      }
    }
  },
})

export const rmJobs = new ValidatedMethod({
  name: 'rm.jobs',
  schema: {
    ids: Array,
    ['ids.$']: String,
    reason: String,
  },
  async validate(...args) {
    debug('validate args', args)

    if (!Meteor.userId()) {
      return { status: 'failed', message: 'Please login' }
    }
    const user = await Meteor.userAsync()
    if (!user) {
      return { status: 'failed', message: 'Please login' }
    }
    // check the permission
    const myRoles = await getMyRoles()
    if (!canDo({ op: 'deleteAny', role: myRoles, resource: 'job', log: 'rm.jobs' })) {
      return {
        status: 'failed',
        message: 'Permission denied',
      }
    }
  },

  /**
   * @param {Object} param0 - job ids
   * @param {string} param0._id
   * @param {string} param0.reason
   * @returns {Object} result
   * - {string} result.status - success or failed
   * - {string} result.message
   */
  async run({ ids, reason }) {
    try {
      let n = 0
      n = n + (await Stages.removeAsync({ jobId: { $in: ids } }))
      n = n + (await Tasks.removeAsync({ jobId: { $in: ids } }))
      n = n + (await Jobs.removeAsync({ _id: { $in: ids } }))
      n = n + (await Messages.removeAsync({ jobId: { $in: ids } }))
      logger.audit(`Removed ${n} jobs ${reason}`, {
        ids,
        reason: `${reason} (${n} objects)`,
      })
      return { status: 'success', message: 'Removed jobs' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing jobs: ${e.message}`,
      }
    }
  },
})

/**
 * From properties page, user can send message to other person in the listing
 */
export const personSendMessage = new ValidatedMethod({
  name: 'person.sendMessage',
  schema: {
    jobId: String,
    toUserId: String,
    message: String,
    method: {
      type: String,
      allowedValues: ['sms', 'email'],
    },
  },
  async validate(...args) {
    debug('validate args', args)
    const { jobId, method, message } = args[0]
    if (method === 'sms' && message.length > 160) {
      return { status: 'failed', message: 'message was too long to be sent via SMS' }
    }
    if (!Meteor.userId()) {
      return { status: 'failed', message: 'Please login' }
    }

    if (!(await Meteor.userAsync())) {
      return { status: 'failed', message: 'Please login' }
    }

    this.job = await Jobs.findOneAsync({
      _id: jobId,
    })
    if (!this.job) {
      debug('job was not found', jobId, Meteor.userId())
      return { status: 'failed', message: 'Your job was not found' }
    }

    try {
      await checkUpdateOwnJobPermission(this.job)
    } catch (e) {
      return { status: 'failed', message: e.message }
    }
  },
  async run({ jobId, toUserId, message, method }) {
    const toUser = await Meteor.users.findOneAsync({ _id: toUserId })
    if (!toUser) {
      return { status: 'failed', message: 'Person was not found' }
    }

    toUser.roles = await Roles.getRolesForUserAsync(toUserId)
    const toProfile = await Profiles.findOneAsync({ userId: toUserId })
    toUser.mobile = toProfile.mobile
    toUser.name = toProfile.name
    const toPerson = getPerson(this.job, toUserId)
    if (!toPerson) {
      return { status: 'failed', message: 'Person was not found in job' }
    }

    let res
    if (method === 'sms') {
      res = await sendTrigger({
        slug: 'nudge-cus-sms',
        people: [toUser],
        jobId,
        message,
      })
    }
    if (method === 'email') {
      res = await sendTrigger({
        slug: 'nudge-cus-email',
        people: [toUser],
        jobId,
        message,
      })
    }

    if (res?.status === 'failed') {
      return res
    }
    return {
      status: 'success',
      message: 'Message sent',
    }
  },
})

Meteor.methods({
  async 'update.jobs'({ id, form }) {
    // check for permission
    const myRoles = await getMyRoles()
    if (
      !canDo({
        op: 'updateAny',
        role: myRoles,
        resource: 'job',
        log: 'update.jobs',
      })
    ) {
      return { status: 'failed', message: 'Permission denied' }
    }

    try {
      const id = form._id
      delete form._id
      const isDeleting = form.isDeleting
      const n = await Jobs.updateAsync(id, { $set: form })

      return { status: 'success', message: `Updated ${n} job(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating job: ${e.message}`,
      }
    }
  },
  'check.users.jobs': async ({ id, userId }) => {
    try {
      check(id, String)
      check(userId, String)

      const job = await Jobs.findOneAsync({
        _id: id,
        'persons.userId': `${userId}`,
      })

      if (!job)
        return {
          status: 'success',
          found: false,
          message: `Found no user with ${userId} on job`,
        }
      await checkReadJobPermission(job)
      return {
        status: 'failed',
        found: true,
        message: `user with id ${userId} already exists in job`,
      }
    } catch (e) {
      return {
        status: 'failed',
        found: false,
        message: `Error finding user ${userId} on job ${id}: ${e.message}`,
      }
    }
  },
  'insert.user.jobs': async ({ id, user }) => {
    try {
      check(id, String)
      check(user, Object)

      const job = await Jobs.findOneAsync({ _id: id })
      if (!job) return { status: 'failed', message: `Could not find job with id ${id}` }

      await checkUpdateOwnJobPermission(job)

      let { _id, userId, role, nickname, name, mobile, email } = user

      // When called from the front end, data is omitted due to privacy
      if (!mobile || !email) {
        const profile = await Profiles.findOneAsync({ _id: _id })
        mobile = profile.mobile
        email = (await Meteor.users.findOneAsync(userId)).emails[0].address
      }

      const person = {
        email: email,
        mobile: mobile,
        name: name,
        nickname: nickname || name,
        role: role,
        userId: userId,
      }

      await Jobs.updateAsync(
        { _id: id },
        {
          $push: {
            persons: person,
          },
        }
      )

      logger.audit(`Added ${CONSTANTS.ROLES[role]} ${name} to job ${job.name}`, {
        jobId: id,
        ...user,
      })
      return { status: 'success', message: `Added user to job` }
    } catch (e) {
      logger.error(`Error adding user to job: ${e.message}`)
      return {
        status: 'failed',
        message: `Error adding user to job: ${e.message}`,
      }
    }
  },
  'replace.user.jobs': async ({ id, form, notification = false }) => {
    try {
      check(id, String)
      check(form, Object)
      check(notification, Boolean)

      const job = await Jobs.findOneAsync(id)
      if (!job) throw new Error(`Could not find job with id ${id}`)

      await checkUpdateOwnJobPermission(job)

      const { role, userId } = form
      if (!role) throw new Error('Missing role')

      const { user, profile } = await getProfile(userId)
      if (!user || !profile) throw new Error(`User or profile for ${userId} not found`)
      form.email = user?.emails[0]?.address || user.username
      form.mobile = profile?.mobile || ''
      form.nickname = profile?.nickname || profile?.name

      await replacePersonOnJob({ id, user: form, role })
      const tasks = await Tasks.find(
        { jobId: job._id },
        { hint: 'by_jobId' }
      ).fetchAsync()
      if (tasks) await taskReplacePersonByRole({ id, role, user: form })

      // send notification,
      // TODO: review and remove this
      if (notification) {
        const people = job.persons.map((person) => {
          return {
            ...person,
            _id: person.userId,
            username: person.email,
            roles: [person.role],
          }
        })
        // if (['WSADM'].includes(role)) {
        //   await sendTrigger({
        //     slug: 'reassign-con',
        //     listingId: listing._id,
        //     role,
        //     people,
        //     data: {
        //       conveyancer: form.name,
        //     },
        //   })
        // }
      }
      return {
        status: 'success',
        message: `Successfully added ${form.name} as ${CONSTANTS.ROLES[role]}`,
      }
    } catch (e) {
      logger.error(`Error updating user: ${e.message}`)
      return {
        status: 'failed',
        message: `Error updating user: ${e.message}`,
      }
    }
  },

  'job.download': async ({ jobId, viewas }) => {
    try {
      check(jobId, String)
      if (!(await Meteor.userAsync())) {
        return { status: 'failed', message: 'Please login' }
      }

      let s3params = {
        Bucket: Meteor.settings.private.DOCUMENTS_BUCKET,
        Key: '',
      }

      const job = await Jobs.findOneAsync(jobId)

      let fileList = await Promise.all(
        job.docs
          .filter((doc) => doc.type !== 'image')
          .map(async (doc) => {
            if (doc.url) {
              s3params.Key = doc.url
              return {
                fileName: `${CONSTANTS.DOCUMENT_TYPES[doc.type]}.pdf`,
                result: await downloadFile(s3params),
              }
            }
          })
      )

      fileList = await Promise.all(fileList)

      //customer will only get pdf document
      // TODO: There is security issue here. client can fake viewas value.
      if (['ADM', 'WSADM'].includes(viewas)) {
        const messages = await Messages.find({ jobId }).fetchAsync()
        const tasks = await Tasks.find({ jobId: job._id }).fetchAsync()
        const mergedData = { messages, job, tasks }
        const timezone = await Profiles.findOneAsync({ userId: Meteor.userId() })
          ?.timezone
        fileList.push({
          fileName: 'technical-data.json',
          result: { Body: JSON.stringify(mergedData, null, 2) },
        })
        //message HTML
        fileList.push({
          fileName: 'message.html',
          result: { Body: produceHTML(messages, timezone) },
        })
      }

      return {
        status: 'success',
        message: 'downloaded file',
        data: fileList,
      }
    } catch (e) {
      console.error(e)
      return {
        status: 'failed',
        message: `Error when downloading listing: ${e.message}`,
      }
    }
  },
})

export const cleanupJob = new ValidatedMethod({
  name: 'cleanup.job',
  schema: {
    jobId: String,
    roles: { type: Array, optional: true },
    ['roles.$']: String,
  },
  async validate(...args) {
    if (!Meteor.userId()) {
      return { status: 'failed', message: 'Please login' }
    }
    const user = await Meteor.userAsync()
    if (!user) {
      return { status: 'failed', message: 'Please login' }
    }
    // check the permission
    const myRoles = await getMyRoles()
    if (!canDo({ op: 'deleteAny', role: myRoles, resource: 'job', log: 'rm.jobs' })) {
      return {
        status: 'failed',
        message: 'Permission denied',
      }
    }
  },
  /**
   * @param {Object} param0 - job id
   * @param {string} param1 - roles
   * @returns {Object} result
   * - {string} result.status - success or failed
   * - {string} result.message
   */

  async run(...args) {
    try {
      const { jobId, roles = [] } = args[0]
      let stats = { roles }
      const job = await Jobs.findOneAsync({ _id: jobId })
      if (job) {
        stats.job = job.name
        stats.stages = await Stages.removeAsync({ jobId: job._id })
        stats.tasks = await Tasks.removeAsync({ jobId: job._id })
        stats.jobs = await Jobs.removeAsync({ _id: job._id })
        // Remove the users too (Participant and Boss by default)
        const userIds = job.persons
          .filter((p) => roles.includes(p.role))
          .map((p) => p.userId)
        stats.profiles = await Profiles.removeAsync({ userId: { $in: userIds } })
        stats.users = await Meteor.users.removeAsync({ _id: { $in: userIds } })
      } else {
        debug('Job not found')
        return { status: 'failed', message: 'Job not found' }
      }
      debug('cleanup.jobs', stats)
      return { status: 'success', message: `Removed ${n} job/user/profile fragments` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing job: ${e.message}`,
      }
    }
  },
})
