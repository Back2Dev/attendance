import { Meteor } from 'meteor/meteor'
import MyCollection from './schema'
const debug = require('debug')('target:myCollection')

Meteor.methods({
  'rm.myCollection': (id) => {
    try {
      const n = MyCollection.remove(id)
      return { status: 'success', message: `Removed singularCollection` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing singularCollection: ${e.message}`,
      }
    }
  },
  'update.myCollection': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = MyCollection.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} singularCollection(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating singularCollection: ${e.message}`,
      }
    }
  },
  'insert.myCollection': (form) => {
    try {
      const id = MyCollection.insert(form)
      return { status: 'success', message: `Added singularCollection` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding singularCollection: ${e.message}`,
      }
    }
  },
})
