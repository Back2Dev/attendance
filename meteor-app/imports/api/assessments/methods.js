import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import Assessment from './schema'
import Counters from '/imports/api/counters/schema'
import Logger from './logger'
import { LOG_EVENT_TYPES, STATUS_UPDATE, MECHANIC_UPDATE, NEW_JOB, PAID, UNPAID } from '/imports/api/constants'

const debug = require('debug')('b2b:assessment-methods')

const myThrow = message => {
  throw new Meteor.Error(message)
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
      Assessment.insert(form)
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

      Assessment.update(jobId, { $set: { status: updatedStatus } })
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
        const job = Assessment.findOne({ jobNo })
        if (!job) myThrow('Could not find job with jobNo ' + jobNo)
        const n = Assessment.update(job._id, { $set: { paid: true, charge_token } })
        if (n)
          Logger.insert({
            user: 'Anonymous',
            aId: job._id,
            status: job.status,
            eventType: LOG_EVENT_TYPES[PAID]
          })
        // Ideally we should call the pinpayments API
        // to check that the charge_token is valid
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
      Assessment.update(jobId, { $set: { paid: !job.paid } })
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
        Assessment.update(_id, { $set: { mechanic: data } })
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
