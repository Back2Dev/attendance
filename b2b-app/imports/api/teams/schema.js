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

const Teams = new Mongo.Collection('teams')

export const TeamsSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: String,
  devs: {
    type: Array,
    optional: true,
  },
  'devs.$': String,

  createdAt,
  updatedAt,
})

Teams.attachSchema(TeamsSchema)

export default Teams
