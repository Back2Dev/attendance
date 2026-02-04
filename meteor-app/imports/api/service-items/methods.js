import { Meteor } from 'meteor/meteor'
import ServiceItems from './schema'

Meteor.methods({
  'rm.ServiceItems': async (id) => {
    await ServiceItems.removeAsync(id)
  },
  'update.ServiceItems': async (form) => {
    const id = form._id
    delete form._id
    await ServiceItems.updateAsync(id, { $set: form })
  },
  'add.ServiceItems': async (form) => {
    await ServiceItems.insertAsync(form)
  },
})
