
import { Meteor } from 'meteor/meteor'
import Reports from './schema'
const debug = require('debug')('b2b:reports')

Meteor.methods({
  'report.create'(report) {
    try {
      const id = Reports.insert(report)
      debug(`id ${id}`)

      return id
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  
  'report.push'(id, description, object, type) {
    try {
      const event = { description, object, type, timestamp: new Date() }
      const n = Reports.update(id, { $push: { events: event } })
      if (n !== 1) throw new Meteor.Error('Update did not work')
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  }
})
