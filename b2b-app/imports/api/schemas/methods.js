import { Meteor } from 'meteor/meteor'
import Schemas from './schema'
const debug = require('debug')('app:schemas')

Meteor.methods({
  'rm.schemas': (id) => {
    try {
      const n = Schemas.remove(id)
      return { status: 'success', message: `Removed schema` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing schema: ${e.message}`,
      }
    }
  },
  'update.schemas': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Schemas.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} schema(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating schema: ${e.message}`,
      }
    }
  },
  'insert.schemas': (form) => {
    try {
      const id = Schemas.insert(form)
      return { status: 'success', message: 'Added schema' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding schema: ${e.message}`,
      }
    }
  },
})
