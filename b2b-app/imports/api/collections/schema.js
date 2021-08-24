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

const Collections = new Mongo.Collection('collections')

export const ColumnsSchema = new SimpleSchema({
  type: String,
  label: String,
})

export const CollectionsSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: {
    type: String,
    label: 'Collection name',
  },
  active: {
    type: Boolean,
    defaultValue: true,
  },
  columns: {
    type: Array,
    optional: true,
  },
  'columns.$': ColumnsSchema,

  createdAt,
  updatedAt,
})

Collections.attachSchema(CollectionsSchema)

export default Collections
