import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Logger = new Mongo.Collection('logger')

export const LoggerSchema = new SimpleSchema({
  _id: RegExId,
  user: String,
  requestType: { type: String, label: 'Database operation used i.e. submit form, update job etc.' },
  requestBody: { type: String, label: 'Data inserted or updated' },
  createdAt,
  updatedAt,
})

Logger.attachSchema(LoggerSchema);

export default Logger
