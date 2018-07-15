import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Orders = new Mongo.Collection('orders')

export const OrdersSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: "Unique _id",
    optional: false,
  },
  // 0 = Pending, 1 = Sent
  status: {
    type: Number,
    defaultValue: 0,
    label: "Order Status"
  },
  totalPrice: {
    type: Number,
    label: "Total Cost",
    required: true,
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

