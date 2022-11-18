import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  // Blackbox,
  // OptionalBlackbox,
  // OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

export const ALLOWED_TYPES = {
  string: String,
  boolean: Boolean,
  integer: SimpleSchema.Integer,
  array: Array,
  object: Object,
  date: Date,
  foreignKey: String,
}

const Schemas = new Mongo.Collection('schemas')

export const SchemasCollections = new Mongo.Collection('schemasCollections')

export const FieldsSchema = new SimpleSchema({
  colName: { type: String, label: 'Field id' },
  label: { type: String, label: 'Display label (for UI)' },
  type: {
    type: String,
    allowedValues: Object.keys(ALLOWED_TYPES),
  },
  defaultValue: OptionalString, // Will this work?
  optional: { type: Boolean, defaultValue: false },
  isFieldValueLocked: {
    type: Boolean,
    defaultValue: false,
  },

  // For foreign key fields only
  relatedCollection: {
    type: String,
    optional: true,
  },

  // For foreign key fields and object fields only
  displayFormat: {
    type: String,
    optional: true,
  },
})

export const SchemasSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: { type: String, label: 'Collection name' },
  slug: { type: String, label: 'Collection id' },
  extends: OptionalString,
  fields: {
    type: Array,
    optional: true,
  },
  'fields.$': FieldsSchema,
  active: {
    type: Boolean,
    defaultValue: true,
  },
  isDocumentInsertLocked: {
    type: Boolean,
    defaultValue: false, // By default anyone can insert a document into the collection
  },
  isSchemaEditLocked: {
    type: Boolean,
    defaultValue: true, // By default only the super admin can edit the schemas
  },
  createdAt,
  updatedAt,
})

Schemas.attachSchema(SchemasSchema)

export default Schemas
