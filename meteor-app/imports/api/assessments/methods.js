import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import Assessment from './assessment'
import Logger from './logger'

Meteor.methods({
  'assessment.insert'(form) {
    check(form, Object)

    Assessment.insert(form)
  },
  'assessment.updateJobDetail'(jobId, updatedJob) {
    check(jobId, String)
    check(updatedJob, Object)

    Assessment.update(jobId, { $set: { updatedJob } });
  },
  'logger.insert'(log) {
    check(log, Object)

    Logger.insert(log)
  },
})
