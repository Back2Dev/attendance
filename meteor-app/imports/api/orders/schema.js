import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import CONSTANTS from '/imports/api/constants.js'

import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

export const orderedParts = new SimpleSchema({
  name: {
    type: String,
    label: 'Part Name',
  },
  partId: {
    type: String,
    label: 'Part Id',
  },
  partNo: {
    type: String,
    label: 'Part No',
  },
  addedAt: {
    type: Date,
    label: 'Date Added',
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Price in cents',
  },
  qty: {
    type: SimpleSchema.Integer,
    label: 'Quantity',
  },
  userId: {
    type: String,
    label: 'User Id',
  },
})

const Orders = new Mongo.Collection('orders')

export const OrdersSchema = new SimpleSchema({
  _id: RegExId,
  status: {
    type: SimpleSchema.Integer,
    allowedValues: Object.keys(CONSTANTS.ORDER_STATUS_READABLE).map(key => parseInt(key, 10)),
    label: 'Order Status',
  },
  additionalNotes: {
    type: String,
    label: 'Notes',
    optional: true,
  },
  totalPrice: {
    type: SimpleSchema.Integer,
    label: 'Total Cost',
  },
  orderedParts: {
    type: Array,
  },
  'orderedParts.$': orderedParts,
  createdAt,
  updatedAt,
})
Orders.attachSchema(OrdersSchema)
export default Orders
