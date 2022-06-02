import { Meteor } from 'meteor/meteor'
import Punters from './schema'
const debug = require('debug')('app:punters')

Meteor.methods({
  'rm.punters': (id) => {
    try {
      const n = Punters.remove(id)
      return { status: 'success', message: `Removed punter` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing punter: ${e.message}`,
      }
    }
  },
  'rm.all.punters': () => {
    try {
      const n = Punters.remove({})
      return { status: 'success', message: `Removed all punters` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing punter: ${e.message}`,
      }
    }
  },
  'update.punters': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Punters.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} punter(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating punter: ${e.message}`,
      }
    }
  },
  'update.bymno.punters': (memberNo, form) => {
    try {
      const n = Punters.update({ memberNo }, { $set: form })
      return { status: 'success', message: `Updated ${n} punter(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating punter: ${e.message}`,
      }
    }
  },
  'insert.punters': (form) => {
    try {
      const id = Punters.insert(form)
      return { status: 'success', message: `Added punter` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding punter: ${e.message}`,
      }
    }
  },
  'insert.bulk.punters': (rows) => {
    try {
      const id = Punters.batchInsert(rows)
      return { status: 'success', message: `Added ${rows.length} punters` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding punter: ${e.message}`,
      }
    }
  },
})
