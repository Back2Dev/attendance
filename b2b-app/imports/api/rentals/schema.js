import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'meteor/aldeed:simple-schema'

import {
  OptionalRegExId,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Rentals = new Mongo.Collection('rentals')

export const RentalsSchema = new SimpleSchema({
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

Rentals.attachSchema(RentalsSchema)

export default Rentals
