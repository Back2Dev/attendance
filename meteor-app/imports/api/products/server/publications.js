import { Meteor } from 'meteor/meteor'
import Products, { ProductTypes, Carts } from '../schema'
import Members from '/imports/api/members/schema'
import '../methods'

Meteor.publish('all.products', () => Products.find({}))

Meteor.publish('product.types', () => ProductTypes.find({}))

Meteor.publish('products.bytype', (type, cartId) => {
  return [Products.find({ active: true, type }), ProductTypes.find(), Carts.find(cartId)]
})

Meteor.publish('product.bycode', code => {
  return Products.find({ active: true, code })
})
// TODO: check if it is real
Meteor.publish('cart', (id, memberId) => [Carts.find(id), Members.find(memberId)])
