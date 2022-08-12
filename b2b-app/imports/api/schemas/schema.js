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

const Schemas = new Mongo.Collection('schemas')

export const SchemasSchema = new SimpleSchema({
  _id: OptionalRegExId,

  
  "name": String,
  "fields": {
    "type": Array,
    "optional": true
  },
  "fields.$": "FieldSchema",
  "active": {
    "type": Boolean,
    "defaultValue": true
  }
,

  createdAt,
  updatedAt,
})

Schemas.attachSchema(SchemasSchema)

export default Schemas
