import { Meteor } from 'meteor/meteor'
import Assessment from '../schema'
import Services from '../services'
import ServiceItems from '../serviceItems'
import Logger from '../logger'
import { JOB_STATUS_ALL, JOB_STATUS_COMPLETE } from '/imports/api/constants'

// Mainly to get updated changes reflected in job cart
Meteor.publish('services.all', () => {
  return Services.find({})
})

Meteor.publish('all.serviceItems', () => {
  return ServiceItems.find({})
})

Meteor.publish('all.services', () => {
  return [ServiceItems.find({}), Services.find({})]
})

Meteor.publish('assessments.all', () => {
  return Assessment.find({})
})

Meteor.publish('assessments.current', () => {
  return Assessment.find({ status: { $in: JOB_STATUS_ALL } })
})

Meteor.publish('assessments.archive', () => {
  return Assessment.find({ status: { $in: JOB_STATUS_COMPLETE } })
})

Meteor.publish('logger.assessment', aId => {
  if (aId) {
    return Logger.find({ aId })
  }
})

Meteor.methods({
  'rm.ServiceItems': id => {
    ServiceItems.remove(id)
  },
  'update.ServiceItems': form => {
    const id = form._id
    delete form._id
    ServiceItems.update(id, { $set: form })
  },
  'add.ServiceItems': form => {
    ServiceItems.insert(form)
  }
})
