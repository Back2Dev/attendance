import { Meteor } from 'meteor/meteor'
import EventTypes from '../schema'

Meteor.publish('all.event-types', function () {
  return EventTypes.find({ active: true })
})
