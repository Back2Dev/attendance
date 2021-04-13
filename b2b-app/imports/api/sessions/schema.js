import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  RegExId,
  OptionalRegExId,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Sessions = new Mongo.Collection('sessions')
if (Meteor.isServer) {
  Sessions._ensureIndex(
    {
      status: 1,
    },
    { name: 'status' }
  )
}

const ToolItem = new SimpleSchema({
  _id: RegExId,
  name: String,
})

export const SessionsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  memberId: RegExId,
  eventId: RegExId,
  // event name
  name: {
    type: String,
    label: 'Session name',
  },
  memberName: {
    type: String,
    label: 'Member name',
  },
  status: {
    type: SimpleSchema.Integer,
    allowedValues: [
      1, // booked
      0, // canceled
      2, // attended?
    ],
    defaultValue: 1,
  },
  // array of tools selected
  tools: {
    type: Array,
    optional: true,
  },
  'tools.$': ToolItem,
  // the date/time in the future
  bookedDate: {
    type: Date,
    optional: true,
  },
  // the date/time user booked this session, it may equa to createdAt
  bookedAt: {
    type: Date,
    optional: true,
  },
  createdAt,
  updatedAt,
})

Sessions.attachSchema(SessionsSchema)

export default Sessions
