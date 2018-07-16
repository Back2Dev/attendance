import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import orderedParts from '/imports/api/orders/orderedParts'
import CONSTANTS from '/imports/api/constants.js'


import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Orders = new Mongo.Collection('orders')

export const OrdersSchema = new SimpleSchema({
  _id: REGEX_ID,
  status: {
    type: SimpleSchema.Integer,
    allowedValues: Object.keys(CONSTANTS.ORDER_STATUS_READABLE),
    label: "Order Status",
  },
  additionalNotes: {
    type: String,
    label: "Notes",
    optional: true,
  },
  totalPrice: {
    type: Number,
    label: "Total Cost",
  },
  orderedParts: Array,
  'orderedParts.$': orderedParts,
  createdAt,
  updatedAt,
})
Orders.attachSchema(OrdersSchema)

export default Orders

