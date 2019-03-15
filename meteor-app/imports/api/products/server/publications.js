import { Meteor } from 'meteor/meteor'
import Products from '../schema'

Meteor.publish('all.products', () => Products.find({ active: true }))

Meteor.publish('product.types', () => ProductTypes.find({}))
