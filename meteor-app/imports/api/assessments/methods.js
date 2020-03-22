import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import axios from 'axios'

import Assessments from './schema'
import Counters from '/imports/api/counters/schema'
import Logger from './logger'
import { LOG_EVENT_TYPES, STATUS_UPDATE, MECHANIC_UPDATE, NEW_JOB, PAID, UNPAID } from '/imports/api/constants'

const debug = require('debug')('b2b:assessment-methods')

const myThrow = message => {
  throw new Meteor.Error(message)
}

const emailReceipt = async ({ job, charge_token }) => {
  const chargeURL = `${Meteor.settings.private.chargeURL}/${charge_token}`
  const request = {
    url: chargeURL,
    method: 'get',
    validateStatus: function(status) {
      return status >= 200
    },
    auth: {
      username: Meteor.settings.private.paymentApiKey,
      password: ''
    }
  }
  debug(`Fetching charge info from ${chargeURL}`, request)
  try {
    const response = await axios(request)
    const { data } = response
    debug(`status: ${response.status} ${response.statusText}`, data.response)
    Assessments.update(job._id, {
      $set: {
        email: data.response.email,
        card: data.response.card
      }
    })
    const bike = `${job.bikeDetails.color} ${job.bikeDetails.make} ${job.bikeDetails.model}`
    Meteor.call(
      'sendGenericInfoEmail',
      data.response.email,
      {
        subject: `Bike service ${job.jobNo} - Payment receipt`,
        name: job.customerDetails.name,
        message: `Your payment of $${job.totalCost / 100} for bike service ${job.jobNo} on your ${bike} was received.

Please come and pick up the bike at your convenience.

If you need to do an out-of-hours pickup, please call us on 0416 988 516 to arrange.
`,
        headline: `Ready for pickup`
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
    getNextJobNo() {
      return incrementCounter(Counters, 'jobs', 1)
    },
    'assessment.insert'(form) {
      check(form, Object)
      // Add in an auto-incrementing the job number
      form.jobNo = (form.customerDetails.isRefurbish ? 'R' : 'C') + Meteor.call('getNextJobNo')
      Assessments.insert(form)
      Logger.insert({
        user: form.assessor,
        status: form.status,
        aId: form._id,
        eventType: LOG_EVENT_TYPES[NEW_JOB]
      })
    },
    'assessment.updateJobStatus'(jobId, updatedStatus) {
      check(jobId, String)
      check(updatedStatus, Number)

      Assessments.update(jobId, { $set: { status: updatedStatus } })
      Logger.insert({
        user: 'Anonymous',
        aId: jobId,
        status: updatedStatus,
        eventType: LOG_EVENT_TYPES[STATUS_UPDATE]
      })
    },
    'service.paid'(jobNo, search) {
      try {
        check(jobNo, String)
        check(search, String)
        debug(`service.paid(${jobNo},${search})`)
        const m = search.match(/\?charge_token=(.*)$/)
        if (!m) myThrow(`Could not extract charge_token from ${search}`)
        const charge_token = m[1]
        const job = Assessments.findOne({ jobNo })
        if (!job) myThrow('Could not find job with jobNo ' + jobNo)
        const n = Assessments.update(job._id, { $set: { paid: true, charge_token } })
        if (n) {
          Logger.insert({
            user: 'Anonymous',
            aId: job._id,
            status: job.status,
            eventType: LOG_EVENT_TYPES[PAID]
          })
          // Now call the pinpayments API
          // to check that the charge_token is valid, and also
          // send the customer a receipt (by email)
          emailReceipt({ job, charge_token })
        }
        const result = { status: 'success', message: 'Payment recorded' }
        debug(result)
        return result
      } catch (e) {
        const result = { status: 'failed', message: e.message }
        debug(result)
        return result
      }
    },
    'assessment.updatePaid'(jobId) {
      check(jobId, String)

      const job = Assessment.findOne(jobId)
      if (!job) throw new Meteor.Error('Could not find job with id ' + jobId)
      Assessments.update(jobId, { $set: { paid: !job.paid } })
      Logger.insert({
        user: 'Anonymous',
        aId: jobId,
        status: job.status,
        eventType: LOG_EVENT_TYPES[job.paid ? UNPAID : PAID]
      })
    },
    'logger.insert'(log) {
      check(log, Object)
    },
    'assessment.update'(job, action, data) {
      const { _id, status } = job
      check(job, Object)
      check(action, String)
      check(data, String)

      if (action === MECHANIC_UPDATE) {
        Assessments.update(_id, { $set: { mechanic: data } })
      }
      Logger.insert({
        user: 'Anonymous', //!! lazy
        status,
        aId: _id,
        data,
        eventType: LOG_EVENT_TYPES[action] // integer
      })
    },
    // returns logs for requested assessment id
    getLogs(aId) {
      check(aId, String)

      return Logger.find({ aId }).fetch()
    }
  })
}
