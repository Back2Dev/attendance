import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Collections from './schema'
const debug = require('debug')('app:collections')

import getCollection from './collections'

Meteor.methods({
  'collections.getRows'({ collectionName, filter }) {
    if (!Match.test(collectionName, String)) {
      return { status: 'failed', message: 'Invalid collection name' }
    }

    if (!Match.test(filter, [String])) {
      return { status: 'failed', message: 'Invalid filter' }
    }

    const { collection } = getCollection(collectionName)
    if (!collection) {
      return {
        status: 'failed',
        message: `Does not support collection: ${collectionName}`,
      }
    }

    // get all data for now
    return {
      status: 'success',
      rows: collection.find({}).fetch(),
    }
  },
  'rm.collections': (id) => {
    try {
      const n = Collections.remove(id)
      return { status: 'success', message: `Removed collection` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing collection: ${e.message}`,
      }
    }
  },
  'update.collections': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Collections.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} collection(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating collection: ${e.message}`,
      }
    }
  },
  'insert.collections': (form) => {
    try {
      const id = Collections.insert(form)
      return { status: 'success', message: `Added collection` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding collection: ${e.message}`,
      }
    }
  },
})
