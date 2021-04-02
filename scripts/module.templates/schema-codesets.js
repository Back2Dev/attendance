import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/schemas/schema-util'

// Define a common schema for all codesets

export const CodesetSchema = new SimpleSchema({
  _id: OptionalRegExId,
  code: String,
  display: String,
  sortOrder: SimpleSchema.Integer,
  createdAt,
  updatedAt
})

const codesets = []

// Template collection definitions and attach schemas
TEMPLATED_COLLECTIONS

export default codesets
