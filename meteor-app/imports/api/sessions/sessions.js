import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema'

import { REGEX_ID } from '/imports/api/schema'

const Sessions = new Mongo.Collection('sessions')

export const SessionsSchema = new SimpleSchema({
  memberId: {
    type: String,
    regEx: REGEX_ID,
    label: "Session Member id",
    optional: false
  },
  timeIn: {
    type: Date,
    label: "Visit start time",
    optional: false
  },
  timeOut: {
    type: Date,
    label: "Visit end time",
    optional: false
  },
  duration: {
    type: Number,
    label: "Duration in hours",
    optional: false
  },
})

Sessions.attachSchema(SessionsSchema)

export default Sessions
