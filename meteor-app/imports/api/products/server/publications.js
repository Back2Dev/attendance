import { Meteor } from 'meteor/meteor'
import Products, { ProductTypes, Carts } from '../schema'
import Members from '../../members/schema'

Meteor.publish('all.products', () => Products.find({ active: true }))

Meteor.publish('product.types', () => ProductTypes.find({}))

Meteor.publish('products.bytype', (type, cartId) => {
  return [Products.find({ active: true, type }), ProductTypes.find(), Carts.find(cartId)]
})

Meteor.publish('product.bycode', code => {
  return Products.find({ active: true, code })
})
// TODO: check if it is real
Meteor.publish('cart', (id, memberId) => [Carts.find(id), Members.find(memberId)])

Meteor.methods({
  'rm.Products': id => {
    Products.remove(id)
  },
  'update.Products': form => {
    const id = form._id
    delete form._id
    Products.update(id, { $set: form })
  },
  'insert.Products': form => {
    console.log('Inserting product', form)
    const id = Products.insert(form)
    console.log('Added ', id)
  }
})