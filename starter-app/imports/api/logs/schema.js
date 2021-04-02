import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  createdAt,
  updatedAt,
  Blackbox,
} from '/imports/api/utils/schema-util'

const Logs = new Mongo.Collection('logs')

export const LogsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  level: {
    type: String,
    label: 'Log level',
  },
  message: String,
  user: {
    type: String,
    label: 'User id, username or name',
    optional: true,
  },
  data: {
    type: SimpleSchema.oneOf(String, Blackbox, Array, Number, Boolean),
    optional: true,
  },
  'data.$': Blackbox,
  createdAt,
  updatedAt,
})

Logs.attachSchema(LogsSchema)

if (Meteor.isServer) {
  Logs.allow({
    insert: function () {
      return true
    },
  })
}

export default Logs
