import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const Transactions = new Mongo.Collection('transactions')

export const TransactionsSchema = new SimpleSchema({
  _id: RegExId,
  createdAt,
  updatedAt
})
Transactions.attachSchema(TransactionsSchema)

export default Transactions
