import { Meteor } from 'meteor/meteor'
import Products, { ProductTypes } from '../schema'

Meteor.publish('all.products', () => Products.find({ active: true }))

Meteor.publish('product.types', () => ProductTypes.find({}))

// Note that 'type' is a number, and the passed parameter will be a string
Meteor.publish('products.bytype', typeString => {
  const type = parseInt(typeString, 10)
  return [Products.find({ active: true, type }), ProductTypes.find({ type })]
})
