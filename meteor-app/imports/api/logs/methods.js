import { Meteor } from 'meteor/meteor'
import Logs from './schema'
const debug = require('debug')('target:logs')

Meteor.methods({
  'rm.logs': async (id) => {
    try {
      const n = await Logs.removeAsync(id)
      return { status: 'success', message: `Removed log` }
    } catch (e) {
      return { status: 'failed', message: `Error removing log: ${e.message}` }
    }
  },
  'update.logs': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Logs.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} log(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating log: ${e.message}` }
    }
  },
  'insert.logs': async (form) => {
    try {
      const id = await Logs.insertAsync(form)
      return { status: 'success', message: `Added log` }
    } catch (e) {
      return { status: 'failed', message: `Error adding log: ${e.message}` }
    }
  }
})
