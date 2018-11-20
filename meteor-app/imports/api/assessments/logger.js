import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
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
  updatedAt,
})

Logger.attachSchema(LoggerSchema);

export default Logger
