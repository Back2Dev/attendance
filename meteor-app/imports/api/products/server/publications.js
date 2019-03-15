import { Meteor } from 'meteor/meteor'
import Products from '../schema'

Meteor.publish('all.products', () => {
  return Products.find({ active: true })
})

Meteor.publish('product.types', () => {
  return Products.find({})
})
