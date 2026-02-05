import { Meteor } from 'meteor/meteor'
import Registrations from './schema'
const debug = require('debug')('target:registrations')

Meteor.methods({
  'rm.registrations': async (id) => {
    try {
      const n = await Registrations.removeAsync(id)
      return { status: 'success', message: `Removed registration` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing registration: ${e.message}`,
      }
    }
  },
  'update.registrations': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Registrations.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} registration(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating registration: ${e.message}`,
      }
    }
  },
  'insert.registrations': async (form) => {
    try {
      const id = await Registrations.insertAsync(form)
      return { status: 'success', message: `Added registration` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding registration: ${e.message}`,
      }
    }
  },
})
