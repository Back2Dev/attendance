import { Meteor } from 'meteor/meteor'
import Events from '../schema'

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

Meteor.methods({
  'rm.Events': id => {
    Events.remove(id)
  },
  'update.Events': form => {
    const id = form._id
    delete form._id
    Events.update(id, { $set: form })
  },
  'add.Events': form => {
    Events.insert(form)
  }
})
