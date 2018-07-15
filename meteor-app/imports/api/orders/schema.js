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
  totalPrice: {
    type: Number,
    label: "Total Cost",
  },
  additionalNotes: {
    type: String,
    label: "Notes",
    optional: true,
  },
  "orderedParts.$": {
    type: Array,
  },
  "orderedParts": {
    type: String,
    autoValue: function () {
      return Meteor.user()._id;
    },
  },
  "orderedParts.$": {
    type: Array,
    id: String,
    label: "Part Id",
  },
  "orderedParts.$": {
    type: Array,
    no: String,
    label: "Part Number",
  },
  "orderedParts.$": {
    type: SimpleSchema.Integer, // qty
    label: "Quantity",
  },
  "orderedParts.$": {
    type: Date,
    label: "Date Ordered",
  },
  addedAt: {
    type: Date,
  },
  createdAt,
  updatedAt,
})
Orders.attachSchema(OrdersSchema)

export default Orders

