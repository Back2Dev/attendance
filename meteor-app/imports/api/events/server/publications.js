import { Meteor } from 'meteor/meteor'
import Events from '../../events/schema'

Meteor.publish('all.events', () => {
  return Events.find({})
})
