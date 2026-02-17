import { Meteor } from 'meteor/meteor'
import Tools from './schema'
const debug = require('debug')('app:tools')

Meteor.methods({
  'rm.tools': async (id) => {
    try {
      const n = await Tools.removeAsync(id)
      return { status: 'success', message: `Removed tool` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing tool: ${e.message}`,
      }
    }
  },
  'update.tools': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Tools.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} tool(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating tool: ${e.message}`,
      }
    }
  },
  'insert.tools': async (form) => {
    try {
      const id = await Tools.insertAsync(form)
      return { status: 'success', message: `Added tool` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding tool: ${e.message}`,
      }
    }
  },
})
