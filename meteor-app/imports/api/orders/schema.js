import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import CONSTANTS from '/imports/api/constants.js'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Orders = new Mongo.Collection('orders')

export const OrdersSchema = new SimpleSchema({
  _id: RegExId,
  status: {
    type: SimpleSchema.Integer,
    allowedValues: Object.keys(CONSTANTS.ORDER_STATUS_READABLE),
    label: "Order Status"
  },
  totalPrice: {
    type: Number,
    label: "Total Cost",
  },
  additionalNotes: {
    type: String,
    label: "Notes",
    optional: true,
  },
  orderedParts: {
    type: Array,   // array of part objects
    label: "Parts",
    min: 1,
  },
  createdAt,
  updatedAt,
})
Orders.attachSchema(OrdersSchema)

export default Orders

