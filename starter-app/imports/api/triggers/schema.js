import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants'

const Events = new Mongo.Collection('events')

export const NotificationSchema = new SimpleSchema({
  number: String,
  trigger: { type: String, allowedValues: Object.keys(CONSTANTS.TRIGGERS) },
  text: String,
  recipients: { type: String, allowedValues: Object.keys(CONSTANTS.ROLES) },
  delay: OptionalString,
  method: OptionalString,
})

export const EventsSchema = new SimpleSchema({
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

Events.attachSchema(EventsSchema)

export default Events
