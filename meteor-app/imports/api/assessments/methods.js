import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import Assessment from './assessment'
import Logger from './logger'
import { LOG_EVENT_TYPES, STATUS_UPDATE, MECHANIC_UPDATE } from '/imports/api/constants'
if (Meteor.isServer) {
  Meteor.methods({
    'assessment.insert'(form) {
      check(form, Object)
      const aId = Assessment.insert(form)
      Logger.insert({
        user: form.assessor, 
        status: form.status,
        aId,
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
      })
    },
    'logger.insert'(log) {
      check(log, Object)
  
    },
    'assessment.update'(job, mechanic){
      console.log(arguments)
      const { _id, status } = job
      check(job, Object)
      check(mechanic, String)
      
      Assessment.update(_id, { $set: {mechanic} },
      Logger.insert({
        status,
        aId: _id,
        eventType: LOG_EVENT_TYPES[MECHANIC_UPDATE] // integer
      })
      );
    },
    // returns logs for requested assessment id
    getLogs(aId) {
      check(aId, String)
      
      return Logger.find({aId}).fetch()
    }
  })
}
