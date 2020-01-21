import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'
import { SessionsSchema } from '/imports/api/sessions/schema'

const SessionListSchema = SessionsSchema.omit('memberId', 'createdAt', 'updatedAt')
const Purchases = new Mongo.Collection('purchases')

export const PurchasesSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: 'Unique id',
    optional: false
  },
  memberId: {
    type: String,
    label: 'Member Id',
    optional: true
  },
  productName: {
    type: String,
    label: 'Product name'
  },
  productId: {
    type: String,
    label: 'Product id'
  },
  code: {
    type: String,
    label: 'Product code'
  },
  userId: {
    type: String,
    optional: true
  },
  price: {
    type: Number,
    label: 'Price paid'
  },
  purchaser: {
    type: String,
    label: 'Purchaser name',
    optional: true
  },
  expiry: {
    type: Date,
    optional: true
  },
  txnDate: {
    type: Date,
    label: 'Transaction date',
    defaultValue: new Date()
  },
  paymentMethod: {
    label: 'Payment method',
    type: String
  },
  remaining: {
    type: SimpleSchema.Integer,
    optional: true
  },
  sessions: {
    type: Array,
    label: 'Array of sessions attended',
    defaultValue: [],
    blackbox: true
  },
  'sessions.$': SessionListSchema,
  qty: {
    type: SimpleSchema.Integer,
    label: 'Quantity',
    defaultValue: 1
  },
  createdAt,
  updatedAt
})

Purchases.attachSchema(PurchasesSchema)

export default Purchases
