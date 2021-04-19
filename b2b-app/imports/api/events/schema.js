import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  RegExId,
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Events = new Mongo.Collection('events')

export const ToolItemSchema = new SimpleSchema({
  _id: RegExId,
  name: String,
  location: OptionalString,
  available: {
    type: Boolean,
    defaultValue: true,
  },
})

export const BookParamsSchema = new SimpleSchema({
  eventId: RegExId,
  toolId: OptionalRegExId,
})

export const CancelBookingParamsSchema = new SimpleSchema({
  sessionId: RegExId,
})

export const EventsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: {
    type: String,
    label: 'Event name',
  },
  courseId: OptionalRegExId,
  backupCourseId: OptionalRegExId,
  coachId: OptionalRegExId, // members id
  // the available tools for select
  tools: {
    type: Array,
    optional: true,
  },
  'tools.$': ToolItemSchema,
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
  //select
  type: {
    type: String,
    allowedValues: ['day', 'monthly', 'once', 'fallback'],
  },
  //checkbox
  days: { type: Array, optional: true },
  'days.$': { type: SimpleSchema.Integer },
  location: {
    type: String,
    label: 'Location',
    optional: true,
  },
  //date picker
  when: {
    type: Date,
    optional: true,
  },
  //checkbox
  active: {
    type: Boolean,
  },
  //number field
  duration: {
    type: SimpleSchema.Integer,
    label: 'Event duration (hours)',
  },
  //number field (cents)
  price: {
    type: SimpleSchema.Integer,
    label: 'Event Price in cents',
    defaultValue: 0,
  },
  createdAt,
  updatedAt,
})

export const defaultObject = {
  name: 'Untitled',
  description: 'Description',
  location: 'Location',
  type: 'day',
  active: false,
  duration: 0,
  price: 0,
}

Events.attachSchema(EventsSchema)

export default Events
