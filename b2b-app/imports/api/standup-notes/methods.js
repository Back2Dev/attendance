import { Meteor } from 'meteor/meteor'
import StandupNotes from './schema'
const debug = require('debug')('app:standupNotes')

Meteor.methods({
  'rm.standupNotes': (id) => {
    try {
      const n = StandupNotes.remove(id)
      return { status: 'success', message: `Removed standupnote` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing standupnote: ${e.message}`,
      }
    }
  },
  'update.standupNotes': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = StandupNotes.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} standupnote(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating standupnote: ${e.message}`,
      }
    }
  },
  'insert.standupNotes': (form) => {
    try {
      const id = StandupNotes.insert(form)
      return { status: 'success', message: `Added standupnote` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding standupnote: ${e.message}`,
      }
    }
  },
})
