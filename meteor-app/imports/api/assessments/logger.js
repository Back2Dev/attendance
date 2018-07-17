import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Logger = new Mongo.Collection('Logger')

export const LoggerSchema = new SimpleSchema({
  _id: RegExId,
  user: String,
  requestType: { type: String, label: 'Database operation used' },
  requestBody: { type: String, label: 'Data inserted, updated or fetched' },
  createdAt,
  updatedAt,
})

Logger.attachSchema('LoggerSchema');

export default Logger
