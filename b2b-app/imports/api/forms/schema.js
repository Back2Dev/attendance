import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/utils/schema-util'

const Forms = new Mongo.Collection('forms')

export const FormsSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: {
    type: String,
    optional: true,
  },
  slug: String,
  source: String,
  survey: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  revision: {
    type: Number,
    defaultValue: 1,
  },
  active: {
    type: Boolean,
    defaultValue: false,
  },
  createdAt,
  updatedAt,
})

Forms.attachSchema(FormsSchema)

export default Forms
