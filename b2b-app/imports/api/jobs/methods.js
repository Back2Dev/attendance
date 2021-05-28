import { Meteor } from 'meteor/meteor'
import Jobs from './schema'
const debug = require('debug')('target:jobs')

Meteor.methods({
  'rm.jobs': (id) => {
    try {
      const n = Jobs.remove(id)
      return { status: 'success', message: `Removed job` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing job: ${e.message}`,
      }
    }
  },
  'update.jobs': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Jobs.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} job(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating job: ${e.message}`,
      }
    }
  },
  'insert.jobs': (form) => {
    try {
      const id = Jobs.insert(form)
      return { status: 'success', message: `Added job` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding job: ${e.message}`,
      }
    }
  },
})
