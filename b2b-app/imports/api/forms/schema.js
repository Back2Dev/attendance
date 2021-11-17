import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  createdAt,
  updatedAt,
  OptionalBlackbox,
} from '/imports/api/utils/schema-util'

const Forms = new Mongo.Collection('forms')

export const FormsSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: {
    type: String,
    optional: true,
  },
  slug: String,
  source: String,
  survey: OptionalBlackbox,
  revision: {
    type: SimpleSchema.Integer,
    defaultValue: 1,
  },
  active: {
    type: Boolean,
    defaultValue: false,
  },
  createdAt,
  updatedAt,
  json: OptionalBlackbox,
})

Forms.attachSchema(FormsSchema)

export default Forms
