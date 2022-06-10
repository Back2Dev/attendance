import { Meteor } from 'meteor/meteor'
import Standups from './schema'
const debug = require('debug')('app:standups')

Meteor.methods({
  'rm.standups': (id) => {
    try {
      const n = Standups.remove(id)
      return { status: 'success', message: `Removed standup` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing standup: ${e.message}`,
      }
    }
  },
  'update.standups': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Standups.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} standup(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating standup: ${e.message}`,
      }
    }
  },
  'insert.standups': (form) => {
    try {
      const id = Standups.insert(form)
      return { status: 'success', message: `Added standup` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding standup: ${e.message}`,
      }
    }
  },
})
