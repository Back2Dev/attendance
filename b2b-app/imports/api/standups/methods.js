import { Meteor } from 'meteor/meteor'
import Standups from './schema'
const debug = require('debug')('app:standups')

Meteor.methods({
  'rm.standups': async (id) => {
    try {
      const n = await Standups.removeAsync(id)
      return { status: 'success', message: `Removed standup` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing standup: ${e.message}`,
      }
    }
  },
  'update.standups': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Standups.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} standup(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating standup: ${e.message}`,
      }
    }
  },
  'insert.standups': async (form) => {
    try {
      const id = await Standups.insertAsync(form)
      return { status: 'success', message: `Added standup` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding standup: ${e.message}`,
      }
    }
  },
})
