import { Meteor } from 'meteor/meteor'
import Products, { ProductTypes, Carts } from '../schema'
import Profiles from '/imports/api/profiles/schema'
import '../methods'

Meteor.publish('all.products', () => Products.find({}))

Meteor.publish('product.types', () => ProductTypes.find({}))

Meteor.publish('products.bytype', (type, cartId) => {
  return [Products.find({ active: true, type }), ProductTypes.find(), Carts.find(cartId)]
})

Meteor.publish('product.byslug', (slug) => {
  return Products.find({ active: true, slug })
})
// TODO: check if it is real
Meteor.publish('cart', (id, profileId) => [Carts.find(id), Profiles.find(profileId)])
