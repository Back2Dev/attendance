import { Meteor } from 'meteor/meteor'
import ServiceItems from '../schema'

Meteor.methods({
  'rm.ServiceItems': id => {
    ServiceItems.remove(id)
  },
  'update.ServiceItems': form => {
    const id = form._id
    delete form._id
    ServiceItems.update(id, { $set: form })
  },
  'add.ServiceItems': form => {
    ServiceItems.insert(form)
  }
})
