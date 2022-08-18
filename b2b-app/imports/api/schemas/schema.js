import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  Blackbox,
  OptionalBlackbox,
  OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const ALLOWED_TYPES = {
  string: String,
  boolean: Boolean,
  integer: SimpleSchema.Integer,
  array: Array,
  object: Object,
  date: Date,
}

const Schemas = new Mongo.Collection('schemas')

export const FieldsSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: Object.keys(ALLOWED_TYPES),
  },
  name: String,
  core: Boolean,
  defaultValue: OptionalString, // Will this work?
  optional: Boolean,
  label: OptionalString,
})

export const SchemasSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: String,
  fields: {
    type: Array,
    optional: true,
  },
  'fields.$': 'FieldsSchema',
  active: {
    type: Boolean,
    defaultValue: true,
  },
  createdAt,
  updatedAt,
})

Schemas.attachSchema(SchemasSchema)

export default Schemas
