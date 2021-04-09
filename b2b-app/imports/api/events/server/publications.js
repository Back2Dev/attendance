import { Meteor } from 'meteor/meteor'
import Events from '../schema'
import '../methods'

Meteor.publish('all.events', () => {
  return Events.find({})
})
