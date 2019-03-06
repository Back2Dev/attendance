import { Meteor } from 'meteor/meteor'
import Products from '../products'

Meteor.publish('all.products', () => {
  return Products.find({ active: true })
})

