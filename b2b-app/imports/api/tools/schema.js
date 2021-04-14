import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Tools = new Mongo.Collection('tools')

export const ToolsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: String,
  location: OptionalString,
  description: OptionalString,
  active: {
    type: Boolean,
    defaultValue: true,
  },
  createdAt,
  updatedAt,
})

Tools.attachSchema(ToolsSchema)

export default Tools
