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

export const SessionsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  memberId: RegExId,
  eventId: OptionalRegExId,
  purchaseId: OptionalRegExId,
  memberName: {
    type: String,
    label: 'Member name',
  },
  name: {
    type: String,
    label: 'Session name',
  },
  status: {
    type: SimpleSchema.Integer,
    defaultValue: 1,
  },
  tools: {
    type: Array,
    optional: true,
  },
  'tools.$': {
    _id: OptionalRegExId,
    name: String,
  },
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
  /**
   * TODO: We may run into problems with these fields. the current meteor-app needs these fields but in this app, we don't have data yet
   */
  // duration: {
  //   type: Number,
  //   label: 'Duration in hours',
  //   optional: false
  // },
  // timeIn: {
  //   type: Date,
  //   label: 'Visit start time',
  //   optional: false
  // },
  // timeOut: {
  //   type: Date,
  //   label: 'Visit end time',
  //   optional: false
  // },
  // price: {
  //   type: SimpleSchema.Integer,
  //   label: 'Session Price in cents',
  //   defaultValue: 0
  // },
  createdAt,
  updatedAt,
})

Sessions.attachSchema(SessionsSchema)

export default Sessions
