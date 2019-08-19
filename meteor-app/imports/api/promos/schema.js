import { Mongo } from 'meteor/mongo'
import SimpleSchema from './simpl-schema'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Promos = new Mongo.Collection('promos')

export const PromosSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: 'Unique id',
    optional: false
  },
  code: {
    type: String,
    label: 'Promo code'
  },
  description: String,
  discount: SimpleSchema.Integer,
  admin: Boolean,
  start: {
    type: Date
  },
  expiry: {
    type: Date,
    optional: true
  },
  createdAt,
  updatedAt
})

Promos.attachSchema(PromosSchema)

export default Promos
