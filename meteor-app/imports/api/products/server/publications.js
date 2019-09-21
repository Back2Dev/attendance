import { Meteor } from 'meteor/meteor'
import Products, { ProductTypes, Carts } from '../schema'

Meteor.publish('all.products', () => Products.find({ active: true }))

Meteor.publish('product.types', () => ProductTypes.find({}))

Meteor.publish('products.bytype', (type, cartId) => {
  return [Products.find({ active: true, type }), ProductTypes.find(), Carts.find(cartId)]
})

Meteor.publish('product.bycode', code => {
  return Products.find({ active: true, code })
})

Meteor.publish('cart', id => Carts.find(id))
