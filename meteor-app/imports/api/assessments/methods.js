import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import Assessment from './assessments'
import Counters from '/imports/api/counters/counters'
import Logger from './logger'
import { LOG_EVENT_TYPES, STATUS_UPDATE, MECHANIC_UPDATE, NEW_JOB } from '/imports/api/constants'

if (Meteor.isServer) {
  Meteor.methods({
    getNextJobNo() {
      return incrementCounter(Counters, 'jobs', 1)
    },
    'assessment.insert'(form) {
      check(form, Object)
      // Add in an auto-incrementing job number
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
