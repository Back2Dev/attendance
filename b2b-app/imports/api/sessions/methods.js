import { Meteor } from 'meteor/meteor'
import Sessions from './schema'
const debug = require('debug')('target:sessions')

Meteor.methods({
  'rm.sessions': (id) => {
    try {
      const n = Sessions.remove(id)
      return { status: 'success', message: `Removed session` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing session: ${e.message}`,
      }
    }
  },
  'update.sessions': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Sessions.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} session(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating session: ${e.message}`,
      }
    }
  },
  'insert.sessions': (form) => {
    try {
      const id = Sessions.insert(form)
      return { status: 'success', message: `Added session` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding session: ${e.message}`,
      }
    }
  },
})
