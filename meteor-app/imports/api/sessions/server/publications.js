import { Meteor } from 'meteor/meteor'
import Sessions from '../schema'

Meteor.publish('all.sessions', () => {
  return Sessions.find({})
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
