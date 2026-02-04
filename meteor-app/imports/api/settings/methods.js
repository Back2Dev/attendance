import { Meteor } from 'meteor/meteor'
import Settings from './schema'
const debug = require('debug')('target:settings')

Meteor.methods({
  'rm.settings': async (id) => {
    try {
      const n = await Settings.removeAsync(id)
      return { status: 'success', message: `Removed setting` }
    } catch (e) {
      return { status: 'failed', message: `Error removing setting: ${e.message}` }
    }
  },
  'update.settings': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Settings.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} setting(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating setting: ${e.message}` }
    }
  },
  'insert.settings': async (form) => {
    try {
      const id = await Settings.insertAsync(form)
      return { status: 'success', message: `Added setting` }
    } catch (e) {
      return { status: 'failed', message: `Error adding setting: ${e.message}` }
    }
  }
})
