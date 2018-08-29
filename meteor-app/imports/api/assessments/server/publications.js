import { Meteor } from 'meteor/meteor'
import Assessment from '../assessment'
import Services from '../services'
import ServiceItems from '../serviceItems'
import Logger from '../logger'
import {JOB_STATUS_ALL} from '/imports/api/constants'

// Mainly to get updated changes reflected in job cart
Meteor.publish('services.all', () => {
  return Services.find({})
})

Meteor.publish('serviceItems.all', () => {
  return ServiceItems.find({})
})

Meteor.publish('assessments.all', () => {
  return Assessment.find({})
})

Meteor.publish('assessments.current', () => {
  return Assessment.find({status: { $in: JOB_STATUS_ALL }})
})

Meteor.publish('logger.assessment', (aId) => {
  if(aId){
    return Logger.find({ aId })
  }
})