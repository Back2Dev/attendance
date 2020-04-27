import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import axios from 'axios'

import Assessments from './schema'
import Counters from '/imports/api/counters/schema'
import Logger from './logger'
import {
  LOG_EVENT_TYPES,
  STATUS_UPDATE,
  MECHANIC_UPDATE,
  SEND_SMS,
  NEW_JOB,
  PAID,
  UNPAID,
  JOB_STATUS,
} from '/imports/api/constants'

const debug = require('debug')('b2b:assessment-methods')

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
    Assessments.update(job._id, {
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
    getNextJobNo() {
      return incrementCounter(Counters, 'jobs', 1)
    },
    'assessment.insert'(form) {
      check(form, Object)
      // Add in an auto-incrementing the job number
      form.jobNo =
        (form.customerDetails.isRefurbish ? 'R' : 'C') +
        Meteor.call('getNextJobNo')
      Assessments.insert(form)
      Logger.insert({
        user: form.assessor,
        status: form.status,
        aId: form._id,
        eventType: LOG_EVENT_TYPES[NEW_JOB],
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
        eventType: LOG_EVENT_TYPES[STATUS_UPDATE],
      })
    },
    'service.paid'(jobNo, search) {
      try {
        check(jobNo, String)
        check(search, String)
        debug(`service.paid(${jobNo},${search})`)
        const m = search.match(/\?charge_token=(.*)$/)
        if (!m)
          myThrow(`Could not extract charge_token from ${search}`)
        const charge_token = m[1]
        const job = Assessments.findOne({ jobNo })
        if (!job) myThrow('Could not find job with jobNo ' + jobNo)
        if (job.paid && job.charge_token && job.card)
          return { status: 'success', message: 'Already paid' }
        const n = Assessments.update(job._id, {
          $set: { paid: true, charge_token },
        })
        if (n) {
          Logger.insert({
            user: 'Anonymous',
            aId: job._id,
            status: job.status,
            eventType: LOG_EVENT_TYPES[PAID],
          })
          // Now call the pinpayments API
          // to check that the charge_token is valid, and also
          // send the customer a receipt (by email)
          emailReceipt({ job, charge_token })
        }
        const result = {
          status: 'success',
          message: 'Payment recorded',
        }
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

      const job = Assessments.findOne(jobId)
      if (!job)
        throw new Meteor.Error('Could not find job with id ' + jobId)
      Assessments.update(jobId, { $set: { paid: !job.paid } })
      Logger.insert({
        user: 'Anonymous',
        aId: jobId,
        status: job.status,
        eventType: LOG_EVENT_TYPES[job.paid ? UNPAID : PAID],
      })
    },
    'assessment.completeJob'(jobId) {
      check(jobId, String)
      debug(`Completing job ${jobId}`)
      Assessments.update(jobId, {
        $set: { status: JOB_STATUS.PICKED_UP },
      })
      Logger.insert({
        user: 'Anonymous',
        aId: jobId,
        status: JOB_STATUS.PICKED_UP,
        eventType: LOG_EVENT_TYPES[STATUS_UPDATE],
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
      try {
        // debug(`assessment.update: ${action} ${data} `, job)
        if (action === SEND_SMS) {
          // Original message was this:        `Your bike is ready for pickup. Cost is $${cost}. Please pay at ${payUrl}`
          // Detect if price was modified, and if so, apply a discount or extras
          const m = data.match(/Cost is [$\s]*(\d+)/i)
          if (m) {
            const newCost = parseInt(m[1]) * 100
            const delta = newCost - job.totalCost
            if (delta !== 0) {
              const newValues = {
                totalCost: newCost,
                comment: `Price adjusted in SMS to $${
                  newCost / 100
                } (was $${job.totalCost / 100})`,
              }
              if (delta < 0) {
                newValues.discount = -delta
              }

              if (delta > 0) {
                // Add in another item to push the price up.
                newValues.additionalFees = job.additionalFees + delta
              }
              debug('Updating assessment:', newValues)
              Assessments.update(_id, { $set: newValues })
            }
          }
        }

        if (action === MECHANIC_UPDATE) {
          Assessments.update(_id, { $set: { mechanic: data } })
        }
        Logger.insert({
          user: 'Anonymous', //!! lazy
          status,
          aId: _id,
          data,
          eventType: LOG_EVENT_TYPES[action], // integer
        })
      } catch (e) {
        debug(`Error ${e.message}`)
      }
    },
    // returns logs for requested assessment id
    getLogs(aId) {
      check(aId, String)

      return Logger.find({ aId }).fetch()
    },
  })
}
