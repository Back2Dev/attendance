import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/utils/schema-util'

const Tools = new Mongo.Collection('tools')
if (Meteor.isServer) {
  Tools._ensureIndex(
    {
      name: 1,
      status: 1,
    },
    { name: 'name_status' }
  )
}

export const ToolsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: String,
  status: {
    type: SimpleSchema.Integer,
    defaultValue: 1,
  },
  createdAt,
  updatedAt,
})

Tools.attachSchema(ToolsSchema)

export default Tools
