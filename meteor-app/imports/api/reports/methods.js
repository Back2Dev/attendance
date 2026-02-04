import { Meteor } from 'meteor/meteor'
import Reports from './schema'
const debug = require('debug')('b2b:reports')

Meteor.methods({
  'report.create': async function (report) {
    try {
      const id = await Reports.insertAsync(report)
      debug(`id ${id}`)

      return id
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },

  'report.push': async function (id, description, object, type) {
    try {
      const event = { description, object, type, timestamp: new Date() }
      const n = await Reports.updateAsync(id, { $push: { events: event } })
      if (n !== 1) throw new Meteor.Error('Update did not work')
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  }
})
