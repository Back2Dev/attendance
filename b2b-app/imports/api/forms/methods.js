import { Meteor } from 'meteor/meteor'
import Forms from './schema'
const debug = require('debug')('target:forms')

Meteor.methods({
  'rm.forms': (id) => {
    try {
      const n = Forms.remove(id)
      return { status: 'success', message: `Removed form` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing form: ${e.message}`,
      }
    }
  },
  'update.forms': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Forms.update(id, { $set: form })
      return { status: 'success', message: 'Form Saved' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating form: ${e.message}`,
      }
    }
  },
  'insert.forms': (form) => {
    try {
      const id = Forms.insert(form)
      return { status: 'success', message: `Added form` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding form: ${e.message}`,
      }
    }
  },
})
