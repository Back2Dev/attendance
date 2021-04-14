import { Meteor } from 'meteor/meteor'
import Events from './schema'
const debug = require('debug')('b2b:events')

Meteor.methods({
  'rm.events': (id) => {
    try {
      const n = Events.remove(id)
      return { status: 'success', message: `Removed event` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing event: ${e.message}`,
      }
    }
  },
  'update.events': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Events.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} event(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating event: ${e.message}`,
      }
    }
  },
  'insert.events': (form) => {
    try {
      const id = Events.insert(form)
      return { status: 'success', message: `Added event` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding event: ${e.message}`,
      }
    }
  },
})
