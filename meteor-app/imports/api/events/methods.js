import { Meteor } from 'meteor/meteor'
import Events from './schema'

Meteor.methods({
  'rm.Events': async (id) => {
    await Events.removeAsync(id)
  },
  'update.Events': async (form) => {
    const id = form._id
    delete form._id
    await Events.updateAsync(id, { $set: form })
  },
  'add.Events': async (form) => {
    await Events.insertAsync(form)
  }
})
