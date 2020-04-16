import { Meteor } from 'meteor/meteor'
import Logs from './schema'
const debug = require('debug')('target:logs')

Meteor.methods({
  'rm.logs': id => {
    try {
      const n = Logs.remove(id)
      return { status: 'success', message: `Removed log` }
    } catch (e) {
      return { status: 'failed', message: `Error removing log: ${e.message}` }
    }
  },
  'update.logs': form => {
    try {
      const id = form._id
      delete form._id
      const n = Logs.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} log(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating log: ${e.message}` }
    }
  },
  'insert.logs': form => {
    try {
      const id = Logs.insert(form)
      return { status: 'success', message: `Added log` }
    } catch (e) {
      return { status: 'failed', message: `Error adding log: ${e.message}` }
    }
  }
})
