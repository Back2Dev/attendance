import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/schema'

const Events = new Mongo.Collection('events')

export const EventsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: {
    type: String,
    label: 'Event name'
  },
  description: {
    type: String,
    label: 'Description',
    optional: true
  },
  type: {
    type: String,
    allowedValues: ['day', 'monthly', 'once', 'fallback']
  },
  days: { type: Array, optional: true },
  'days.$': { type: SimpleSchema.Integer },
  location: {
    type: String,
    label: 'Location',
    optional: true
  },
  when: {
    type: Date,
    optional: true
  },
  active: {
    type: Boolean
  },
  duration: {
    type: SimpleSchema.Integer,
    label: 'Event duration (hours)'
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Event Price in cents',
    defaultValue: 0
  },
  createdAt,
  updatedAt
})

Events.attachSchema(EventsSchema)

export default Events
