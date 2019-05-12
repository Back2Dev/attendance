import { Meteor } from 'meteor/meteor'
import Purchases from '../schema'

Meteor.publish('all.purchases', () => {
  return Purchases.find({})
})

Meteor.publish('purchase', id => {
  return Purchases.findOne(id)
})
