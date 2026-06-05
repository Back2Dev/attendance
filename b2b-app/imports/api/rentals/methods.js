import { Meteor } from 'meteor/meteor'
import Rentals from './schema'
const debug = require('debug')('app:rentals')

Meteor.methods({
  'rm.rentals': async (id) => {
    try {
      const n = await Rentals.removeAsync(id)
      return { status: 'success', message: `Removed tool` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing tool: ${e.message}`,
      }
    }
  },
  'update.rentals': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Rentals.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} tool(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating tool: ${e.message}`,
      }
    }
  },
  'insert.rentals': async (form) => {
    try {
      const id = await Rentals.insertAsync(form)
      return { status: 'success', message: `Added tool` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding tool: ${e.message}`,
      }
    }
  },
})
