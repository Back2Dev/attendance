import { Meteor } from 'meteor/meteor'
import Tools from './schema'
const debug = require('debug')('target:tools')

Meteor.methods({
  'rm.tools': (id) => {
    try {
      const n = Tools.remove(id)
      return { status: 'success', message: `Removed tool` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing tool: ${e.message}`,
      }
    }
  },
  'update.tools': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Tools.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} tool(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating tool: ${e.message}`,
      }
    }
  },
  'insert.tools': (form) => {
    try {
      const id = Tools.insert(form)
      return { status: 'success', message: `Added tool` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding tool: ${e.message}`,
      }
    }
  },
})
