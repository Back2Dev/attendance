import { Meteor } from 'meteor/meteor'
import Teams from './schema'
const debug = require('debug')('app:teams')

Meteor.methods({
  'rm.teams': (id) => {
    try {
      const n = Teams.remove(id)
      return { status: 'success', message: `Removed team` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing team: ${e.message}`,
      }
    }
  },
  'update.teams': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Teams.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} team(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating team: ${e.message}`,
      }
    }
  },
  'insert.teams': (form) => {
    try {
      const id = Teams.insert(form)
      return { status: 'success', message: `Added team` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding team: ${e.message}`,
      }
    }
  },
})
