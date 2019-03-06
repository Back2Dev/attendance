import { Meteor } from 'meteor/meteor'
import Transactions from '../transactions'

Meteor.publish('all.transactions', () => {
  return Transactions.find({}, { sort: { createdAt: -1 } })
})

