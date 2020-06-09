import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import axios from 'axios'
import { cloneDeep } from 'lodash'
import Jobs from './schema'
import Counters from '/imports/api/counters/schema'
import EventLogs from '/imports/api/eventlogs'
import {
  LOG_EVENT_TYPES,
  STATUS_UPDATE,
  MECHANIC_UPDATE,
  NEW_JOB,
  PAID,
  UNPAID,
  JOB_STATUS,
} from '/imports/api/constants'

const debug = require('debug')('b2b:job-methods')

const myThrow = (message) => {
  throw new Meteor.Error(message)
}

const emailReceipt = async ({ job, charge_token }) => {
  const chargeURL = `${Meteor.settings.private.paymentURL}/${charge_token}`
  const request = {
    url: chargeURL,
    method: 'get',
    validateStatus: function (status) {
      return status >= 200
    },
    auth: {
      username: Meteor.settings.private.paymentApiKey,
      password: '',
    },
  }
  debug(`Fetching charge info from ${chargeURL}`, request)
  try {
    const response = await axios(request)
    const { data } = response
    debug(
      `status: ${response.status} ${response.statusText}`,
      data.response
    )
    Jobs.update(job._id, {
      $set: {
        email: data.response.email,
        card: data.response.card,
        paidAt: data.response.captured_at,
      },
    })
    const bike = `${job.bikeDetails.color} ${job.bikeDetails.make} ${job.bikeDetails.model}`
    Meteor.call(
      'sendGenericInfoEmail',
      data.response.email,
      {
        subject: `Bike service ${job.jobNo} - Payment receipt`,
        name: job.customerDetails.name,
        message: `Your payment of $${
          job.totalCost / 100
        } for bike service ${job.jobNo} on your ${bike} was received.

Please come and pick up the bike at your convenience.

If you need to do an out-of-hours pickup, please call us on 0416 988 516 to arrange.
`,
        headline: `Ready for pickup`,
      },
      Meteor.settings.private.genericInfoID
    )
  } catch (error) {
    debug(error)
    // throw new Meteor.Error(error.message)
    return error.message
  }
}

if (Meteor.isServer) {
  Meteor.methods({
    'job.updateJobStatus'(jobId, updatedStatus) {
      check(jobId, String)
      check(updatedStatus, Number)

      Jobs.update(jobId, { $set: { status: updatedStatus } })
      EventLogs.insert({
        who: Meteor.user().username,
        objectId: jobId,
        status: updatedStatus,
        eventType: LOG_EVENT_TYPES[STATUS_UPDATE],
        what: `Status is now ${updatedStatus}`,
      })
    },
    'job.updatePaid'(jobId) {
      check(jobId, String)

      const job = Jobs.findOne(jobId)
      if (!job)
        throw new Meteor.Error('Could not find job with id ' + jobId)
      Jobs.update(jobId, { $set: { paid: !job.paid } })
      EventLogs.insert({
        who: Meteor.user().username,
        objectId: jobId,
        status: job.status,
        eventType: LOG_EVENT_TYPES[job.paid ? UNPAID : PAID],
        what: `Payment is now ${job.paid ? UNPAID : PAID}`,
      })
    },
    'job.completeJob'(jobId) {
      check(jobId, String)
      debug(`Completing job ${jobId}`)
      Jobs.update(jobId, { $set: { status: JOB_STATUS.PICKED_UP } })
      EventLogs.insert({
        who: Meteor.user().username,
        objectId: jobId,
        status: JOB_STATUS.PICKED_UP,
        eventType: LOG_EVENT_TYPES[STATUS_UPDATE],
        what: 'Job is complete',
      })
    },
    'job.save'(data) {
      data.jobNo =
        (data.isRefurbish ? 'R' : 'C') + Meteor.call('getNextJobNo')
      try {
        const contents = cloneDeep(data)
        const id = contents._id
        if (id) {
          delete contents._id
          debug(`Saving job id ${id}`)
          Jobs.update(id, { $set: { ...contents } })
          return id
        } else {
          const id = Jobs.insert(contents)
          debug(`New job id is ${id}`)
          return id
        }
      } catch (e) {
        console.error(
          `Error: [${e.message}] encountered while saving job`
        )
      }
    },
    'job.updateMechanic'(job, action, who) {
      const { _id, status } = job
      check(job, Object)
      check(action, String)
      check(who, String)

      if (action === MECHANIC_UPDATE) {
        Jobs.update(_id, { $set: { mechanic: who } })
      }
      EventLogs.insert({
        who: Meteor.user().username,
        status,
        objectId: _id,
        what: `Assign Mechanic ${who}`,
        eventType: LOG_EVENT_TYPES[action], // integer
      })
    },
    'job.updatePhone'(job, action, what) {
      const { _id, status } = job
      check(job, Object)
      check(action, String)
      check(what, String)
      EventLogs.update({
        who: Meteor.user().username,
        status,
        objectId: _id,
        what: `Called customer ${what}`,
        eventType: LOG_EVENT_TYPES[action], // integer
      })
    },
    'job.updateSms'(job, action, what) {
      const { _id, status } = job
      check(job, Object)
      check(action, String)
      check(what, String)
      EventLogs.insert({
        who: Meteor.user().username,
        status,
        objectId: _id,
        what: `Sent SMS ${what}`,
        eventType: LOG_EVENT_TYPES[action], // integer
      })
    },
  })
}
