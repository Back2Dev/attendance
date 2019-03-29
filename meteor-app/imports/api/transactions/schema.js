import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema'

import { memberSchema } from '../members/schema';
import { productSchema } from '../products/schema';

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Transactions = new Mongo.Collection('transactions')

export const TransactionsSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: "Unique _id",
    optional: false
  },
  memberId: {
    type: String,
  },
  productId: {
    type: String,
  },
  userId: {
    type: String,
    optional: true,
  },
  price: {
    type: Number,
    label: "Price paid in transaction",
  },
  createdAt,
  updatedAt,
})

Transactions.attachSchema(TransactionsSchema)

export default Transactions
