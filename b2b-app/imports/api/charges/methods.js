import { Meteor } from 'meteor/meteor'
import Charges from './schema'
const debug = require('debug')('app:charges')

Meteor.methods({
  'rm.charges': async (id) => {
    try {
      const n = await Charges.removeAsync(id)
      return { status: 'success', message: `Removed charge` }
    } catch (e) {
      return { status: 'failed', message: `Error removing charge: ${e.message}` }
    }
  },
  'update.charges': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Charges.updateAsync(id, { $set: form })
      return { status: 'success', message: `Updated ${n} charge(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating charge: ${e.message}` }
    }
  },
  'insert.charges': async (form) => {
    try {
      const id = await Charges.insertAsync(form)
      return { status: 'success', message: `Added charge` }
    } catch (e) {
      return { status: 'failed', message: `Error adding charge: ${e.message}` }
    }
  },
})
