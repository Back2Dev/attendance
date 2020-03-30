import { Meteor } from 'meteor/meteor'
import Settings from './schema'
const debug = require('debug')('target:settings')

Meteor.methods({
  'rm.settings': id => {
    try {
      const n = Settings.remove(id)
      return { status: 'success', message: `Removed setting` }
    } catch (e) {
      return { status: 'failed', message: `Error removing setting: ${e.message}` }
    }
  },
  'update.settings': form => {
    try {
      const id = form._id
      delete form._id
      const n = Settings.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} setting(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating setting: ${e.message}` }
    }
  },
  'insert.settings': form => {
    try {
      const id = Settings.insert(form)
      return { status: 'success', message: `Added setting` }
    } catch (e) {
      return { status: 'failed', message: `Error adding setting: ${e.message}` }
    }
  }
})
