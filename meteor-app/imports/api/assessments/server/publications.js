import { Meteor } from 'meteor/meteor'
import Assessments from '../schema'
import Services from '../services'
import ServiceItems from '../../service-items/schema'
import Logger from '../logger'
import {
  JOB_STATUS_ALL,
  JOB_STATUS_COMPLETE,
} from '/imports/api/constants'

// Mainly to get updated changes reflected in job cart
Meteor.publish('services.all', () => {
  return Services.find({})
})

Meteor.publish('all.services', () => {
  return [ServiceItems.find({}), Services.find({})]
})

Meteor.publish('assessments.all', () => {
  return Assessments.find({})
})

Meteor.publish('assessments.current', () => {
  return Assessments.find(
    { status: { $in: JOB_STATUS_ALL } },
    { sort: { createdAt: -1 }, limit: 50 }
  )
})

Meteor.publish('assessments.jobNo', (jobNo) => {
  return Assessments.find({ jobNo })
})

Meteor.publish('assessments.archive', () => {
  return Assessments.find({ status: { $in: JOB_STATUS_COMPLETE } })
})

Meteor.publish('logger.assessment', (aId) => {
  if (aId) {
    return Logger.find({ aId })
  }
})
