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

const ServiceItems = new Mongo.Collection('serviceItems')

export const ServiceItemsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: {
    type: String,
    label: 'Parts description',
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Price in cents',
  },
  code: {
    type: String,
    label: 'Code to indicate if item is for front or back of bike',
  },
  category: {
    type: String,
    label: 'Parts category',
  },
  used: {
    type: Boolean,
    label: 'Is item new or used',
  },
  numbersOfUsed: {
    type: Number,
    defaultValue: 0,
  },
  createdAt,
  updatedAt,
})

ServiceItems.attachSchema(ServiceItemsSchema)

export default ServiceItems
