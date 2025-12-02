import { Meteor } from 'meteor/meteor'
import StandupNotes from './schema'
const debug = require('debug')('app:standupNotes')

Meteor.methods({
  'rm.standupNotes': async (id) => {
    try {
      const n = await StandupNotes.removeAsync(id)
      return { status: 'success', message: `Removed standupnote` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing standupnote: ${e.message}`,
      }
    }
  },
  'update.standupNotes': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await StandupNotes.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} standupnote(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating standupnote: ${e.message}`,
      }
    }
  },
  'insert.standupNotes': async (form) => {
    try {
      const id = await StandupNotes.insertAsync(form)
      return { status: 'success', message: `Added standupnote` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding standupnote: ${e.message}`,
      }
    }
  },
})
