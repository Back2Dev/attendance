import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  OptionalBlackbox,
  OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Registrations = new Mongo.Collection('registrations')

export const RegistrationsSchema = new SimpleSchema({
  _id: OptionalRegExId,

  name: String,
  schema: OptionalBlackbox,
  description: OptionalString,
  active: {
    type: Boolean,
    defaultValue: true,
  },
  createdAt,
  updatedAt,
})

Registrations.attachSchema(RegistrationsSchema)

export default Registrations
