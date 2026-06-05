import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalString,
  OptionalBlackbox,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Locations = new Mongo.Collection('locations')

const MapSchema = new SimpleSchema({
  title: String,
  imageUrl: String,
})

export const LocationsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  slug: String,
  title: String,
  map: {
    type: Array,
    optional: true,
  },
  'map.$': MapSchema,
  description: { type: Array, optional: true },
  'description.$': String,
  difficulty: {
    type: String,
    allowedValues: ['beginner', 'intermediate', 'advanced'],
    defaultValue: 'beginner',
  },
  pageContent: OptionalBlackbox,
  active: {
    type: Boolean,
    defaultValue: true,
  },
  createdAt,
  updatedAt,
})

Locations.attachSchema(LocationsSchema)

export default Locations
