import { Meteor } from 'meteor/meteor'
import ServiceItems from '../schema'
import '../methods'

Meteor.publish('all.serviceItems', () => {
  return ServiceItems.find({})
})

Meteor.publish('serviceitem', id => {
  return ServiceItems.findOne(id)
})
