import { Meteor } from 'meteor/meteor'
import ServiceItems from './schema'
const debug = require('debug')('target:serviceItems')

Meteor.methods({
  'rm.serviceItems': async (id) => {
    try {
      const n = await ServiceItems.removeAsync(id)
      return { status: 'success', message: 'Removed service_item' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing service_item: ${e.message}`,
      }
    }
  },
  'update.serviceItems': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await ServiceItems.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} service_item(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating service_item: ${e.message}`,
      }
    }
  },
  'insert.serviceItems': async (form) => {
    try {
      const id = await ServiceItems.insertAsync(form)
      return { status: 'success', message: 'Added service_item' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding service_item: ${e.message}`,
      }
    }
  },
})
