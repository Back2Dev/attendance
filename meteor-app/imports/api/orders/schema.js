import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import CONSTANTS from '/imports/api/constants.js'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Orders = new Mongo.Collection('orders')

export const OrdersSchema = new SimpleSchema({
  _id: REGEX_ID,
  status: {
    type: SimpleSchema.Integer,
    allowedValues: Object.keys(CONSTANTS.ORDER_STATUS_READABLE),
    label: "Order Status"
  },
  additionalNotes: {
    type: String,
    label: "Notes",
    optional: true,
  },
  "orderedParts.$": [{
    type: Array,
    part: {
      type: String,
    },
    partId: {
      type: String,
    },
    partNo: {
      type: String,
    },
    price: {
      type: SimpleSchema.Integer,
      label: "Price",
    },
    qty: {
      type: SimpleSchema.Integer,
      label: "quantity",
    },
    userId: {
      type: String,
      autoValue: function () {
        return Meteor.userId()
      },
    }],
  totalPrice: {
    type: Number,
    label: "Total Cost",
  },
  addedAt: {
    type: Date,
  },
  createdAt,
  updatedAt,
})
Orders.attachSchema(OrdersSchema)

export default Orders

