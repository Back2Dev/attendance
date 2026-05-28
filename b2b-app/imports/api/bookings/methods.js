import { Meteor } from 'meteor/meteor'
import Bookings from './schema'
const debug = require('debug')('app:bookings')

Meteor.methods({
  'rm.bookings': async (id) => {
    try {
      const n = await Bookings.removeAsync(id)
      return { status: 'success', message: `Removed session` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing session: ${e.message}`,
      }
    }
  },
  'update.bookings': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Bookings.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} session(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating session: ${e.message}`,
      }
    }
  },
  'insert.bookings': async (form) => {
    try {
      const id = await Bookings.insertAsync(form)
      return { status: 'success', message: `Added session` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding session: ${e.message}`,
      }
    }
  },
})
