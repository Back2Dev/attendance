import { Meteor } from 'meteor/meteor'
import Sessions from '../schema'
import Members from '/imports/api/members/schema'
import Events from '/imports/api/events/schema'

Meteor.publish('all.sessions', () => {
  return Sessions.find({})
})

Meteor.publish('all.members', () => {
  return Members.find({})
})

Meteor.publish('all.events', () => {
  return Events.find({})
})

Meteor.publish('session', id => {
  return Sessions.findOne(id)
})

Meteor.methods({
  'rm.Sessions': id => {
    Sessions.remove(id)
  },
  'update.Sessions': form => {
    const id = form._id
    delete form._id
    Sessions.update(id, { $set: form })
  },
  'add.Sessions': form => {
    Sessions.insert(form)
  }
})
