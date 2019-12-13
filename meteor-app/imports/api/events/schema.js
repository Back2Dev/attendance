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
  //select
  type: {
    type: String,
    allowedValues: ['day', 'monthly', 'once', 'fallback']
  },
  //checkbox
  days: { type: Array, optional: true },
  'days.$': { type: SimpleSchema.Integer },
  location: {
    type: String,
    label: 'Location',
    optional: true
  },
  //date picker
  when: {
    type: Date,
    optional: true
  },
  //checkbox
  active: {
    type: Boolean
  },
  //number field
  duration: {
    type: SimpleSchema.Integer,
    label: 'Event duration (hours)'
  },
  //number field (cents)
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
