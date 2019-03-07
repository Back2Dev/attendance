import { Meteor } from 'meteor/meteor'
import Transactions from '../schema'

Meteor.publish('all.transactions', () => {
  return Transactions.find({})
})
