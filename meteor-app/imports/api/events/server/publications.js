import { Meteor } from 'meteor/meteor'
import Events from '../schema'
import '../methods'

Meteor.publish('all.events', () => {
  return Events.find({})
})

Meteor.publish('id.events', id => {
  return [Events.find(id)]
})

Meteor.publish('add.events', () => {
  return []
})

Meteor.publish('update.Events')
