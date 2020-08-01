import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/schemas/schema-util'

const Logs = new Mongo.Collection('logs')

export const LogsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  // Templated replacement...

  userId: {
    type: OptionalRegExId,
    optional: true,
  },
  memberId: {
    type: OptionalRegExId,
    optional: true,
  },
  oId: {
    type: OptionalRegExId,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
  },
  description: {
    type: String,
  },
  eventTime: {
    type: Date,
  },
  createdAt,
  updatedAt,
})

Logs.attachSchema(LogsSchema)

export default Logs
