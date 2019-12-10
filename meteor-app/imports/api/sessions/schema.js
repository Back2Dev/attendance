import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { REGEX_ID, OptionalRegExId, RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Sessions = new Mongo.Collection('sessions')

export const SessionsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  memberId: RegExId,
  eventId: OptionalRegExId,
  purchaseId: OptionalRegExId,
  memberName: {
    type: String,
    label: 'Member name'
  },
  name: {
    type: String,
    label: 'Session name'
  },
  duration: {
    type: Number,
    label: 'Duration in hours',
    optional: false
  },
  timeIn: {
    type: Date,
    label: 'Visit start time',
    optional: false
  },
  timeOut: {
    type: Date,
    label: 'Visit end time',
    optional: false
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Session Price in cents',
    defaultValue: 0
  },
  createdAt,
  updatedAt
})

Sessions.attachSchema(SessionsSchema)

export default Sessions
