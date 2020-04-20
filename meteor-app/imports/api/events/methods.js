import { Meteor } from 'meteor/meteor'
import Events from './schema'

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
