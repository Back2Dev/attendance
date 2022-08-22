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

const Standups = new Mongo.Collection('standups')

export const StandupsSchema = new SimpleSchema({
  _id: OptionalRegExId,

  teamId: String,
  when: Date,
  notes: {
    type: Array,
    optional: true,
  },
  'notes.$': String,
  createdAt,
  updatedAt,
})

Standups.attachSchema(StandupsSchema)

export default Standups
