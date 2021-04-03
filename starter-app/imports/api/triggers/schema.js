import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants'

const Triggers = new Mongo.Collection('triggers')

export const NotificationSchema = new SimpleSchema({
  number: String,
  trigger: { type: String, allowedValues: Object.keys(CONSTANTS.TRIGGERS) },
  text: String,
  recipients: { type: String, allowedValues: Object.keys(CONSTANTS.ROLES) },
  delay: OptionalString,
  method: OptionalString,
})

export const TriggersSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  notifications: {
    type: Array,
  },
  // we probably need a subject and a url link (for app)
  'notifications.$': {
    type: NotificationSchema,
  },
  createdAt,
  updatedAt,
})

Triggers.attachSchema(TriggersSchema)

export default Triggers
