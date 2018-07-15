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
    type: Array,   // array of part objects
    label: "Parts Ordered",
    min: 1,
    autoValue: function () {
      return Meteor.user()._id;
    },
    addedAt: {
      type: Date,
    },
  },
  createdAt,
  updatedAt,
})
Orders.attachSchema(OrdersSchema)

export default Orders

