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
  name: String, // the first level field name
  label: OptionalString,
  width: { type: Number, optional: true },
  filter: OptionalString,
  readOnly: {
    type: Boolean,
    defaultValue: false,
  },
})

export const SortOrderSchema = new SimpleSchema({
  column: String,
  order: {
    type: String,
    allowedValues: ['asc', 'desc'],
  },
})

export const ViewSchema = new SimpleSchema({
  slug: String,
  name: String,
  columns: {
    type: Array,
    optional: true,
  },
  'columns.$': ColumnsSchema,
  icon: OptionalString,
  sortOrder: SortOrderSchema,
  readOnly: {
    type: Boolean,
    defaultValue: false,
  },
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
  views: {
    type: Array,
  },
  'views.$': ViewSchema,
  createdAt,
  updatedAt,
})

Collections.attachSchema(CollectionsSchema)

export default Collections
