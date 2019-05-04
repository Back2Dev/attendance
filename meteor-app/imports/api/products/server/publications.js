import { Meteor } from 'meteor/meteor'
import Products, { ProductTypes, Carts } from '../schema'

Meteor.publish('all.products', () => Products.find({ active: true }))

Meteor.publish('product.types', () => ProductTypes.find({}))

Meteor.publish('products.bytype', type => {
  return [Products.find({ active: true, type }), ProductTypes.find({ type })]
})

Meteor.publish('product.bycode', code => {
  return Products.find({ active: true, code })
})

Meteor.publish('cart', id => Carts.find(id))
