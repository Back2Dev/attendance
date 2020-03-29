import { Meteor } from 'meteor/meteor'
import Charges from './schema'
const debug = require('debug')('target:charges')

Meteor.methods({
  'rm.charges': id => {
    try {
      const n = Charges.remove(id)
      return { status: 'success', message: `Removed charge` }
    } catch (e) {
      return { status: 'failed', message: `Error removing charge: ${e.message}` }
    }
  },
  'update.charges': form => {
    try {
      const id = form._id
      delete form._id
      const n = Charges.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} charge(s)` }
    } catch (e) {
      return { status: 'failed', message: `Error updating charge: ${e.message}` }
    }
  },
  'insert.charges': form => {
    try {
      const id = Charges.insert(form)
      return { status: 'success', message: `Added charge` }
    } catch (e) {
      return { status: 'failed', message: `Error adding charge: ${e.message}` }
    }
  }
})
