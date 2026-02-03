import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Logger = new Mongo.Collection('logger')

export const LoggerSchema = new SimpleSchema({
  _id: RegExId,
  user: String,
  aId: { type: String, label: 'Assessment ID' },
  status: {
    type: SimpleSchema.Integer,
    label: 'Updated status'
  },
  eventType: {
    type: SimpleSchema.Integer,
    label: 'Type of event'
  },
  data: {
    type: String,
    label: 'Log data', // mechanic name etc
    optional: true
  },
  createdAt,
  updatedAt
})

Logger.attachSchema(LoggerSchema)

export default Logger

Meteor.startup(() => {
  if (Meteor.isServer) {
    const raw = Logger.rawCollection()
    if (typeof raw.createIndex === 'function') {
      raw.createIndex({ aId: 1 }).catch((err) => {
        // Keep startup resilient if index creation fails
        // eslint-disable-next-line no-console
        console.error('Failed to create logger index', err)
      })
    } else if (typeof raw.ensureIndex === 'function') {
      raw.ensureIndex({ aId: 1 })
    }
  }
})
