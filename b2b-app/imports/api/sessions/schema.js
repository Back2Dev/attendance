import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'meteor/aldeed:simple-schema'

import {
  OptionalString,
  RegExId,
  OptionalRegExId,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Sessions = new Mongo.Collection('sessions')
if (Meteor.isServer) {
  Meteor.startup(() => {
    Sessions.rawCollection()
      .createIndex({ status: 1 }, { name: 'status' })
      .catch((err) => console.error('Error creating sessions index', err))
  })
}

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
  role: {
    type: String,
    allowedValues: ['MEM', 'COA'],
    defaultValue: 'MEM',
  },
  status: {
    type: String,
    allowedValues: ['booked', 'cancelled', 'attended', 'missed'],
    defaultValue: 'booked',
  },
  // tool selected
  toolName: OptionalString,
  toolId: OptionalRegExId,
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
