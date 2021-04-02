import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

import MyCollection from './schema.sql'
const debug = require('debug')('se:db:myCollection')

Meteor.methods({
  // Additional fetch method (covered by publications with Mongo)
  'fetch.myCollection': (query) => {
    try {
      const data = MyCollection.find(query || {}).fetch()
      if (data && data.error) throw new Meteor.Error(data.error)
      debug(`Fetched ${data.length} MyCollection records`)
      return { status: 'success', data }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error retrieving singularCollection: ${e.message}`,
      }
    }
  },
  'rm.myCollection': (id) => {
    try {
      const n = MyCollection.remove(id)
      return { status: 'success', message: `Removed MyCollection` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing singularCollection: ${e.message}`,
      }
    }
  },
  'update.myCollection': (form) => {
    try {
      const id = form.id
      delete form.id
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
  'upsert.myCollection': (form) => {
    try {
      const dbu = MyCollection.find({ name: form.name }).fetch()
      if (dbu.length) {
        return { status: 'success', message: `Record exists already` }
      } else {
        const id = MyCollection.insert(form)
        return { status: 'success', message: `Added singularCollection` }
      }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding singularCollection: ${e.message}`,
      }
    }
  },
})
