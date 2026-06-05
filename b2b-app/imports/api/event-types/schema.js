import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const EventTypes = new Mongo.Collection('eventTypes')

export const EventTypesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: {
    type: String,
    label: 'Event type name',
  },
  slug: {
    type: String,
    label: 'Event type slug',
  },
  color: {
    type: String,
    label: 'Calendar color',
    defaultValue: '#1976d2',
  },
  description: OptionalString,
  active: {
    type: Boolean,
    defaultValue: true,
  },
  createdAt,
  updatedAt,
})

EventTypes.attachSchema(EventTypesSchema)

export default EventTypes
