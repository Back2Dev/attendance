import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import Assessment from './assessment'
import Logger from './logger'

if (Meteor.isServer) {
  Meteor.methods({
    'assessment.insert'(form) {
      check(form, Object)
  
      Assessment.insert(form)
    },
    'assessment.updateJobStatus'(jobId, updatedStatus) {
      check(jobId, String)
      check(updatedStatus, Number)
  
      Assessment.update(jobId, { $set: { status: updatedStatus } })
    },
    'logger.insert'(log) {
      check(log, Object)
  
      Logger.insert(log)
    },
  })
}
