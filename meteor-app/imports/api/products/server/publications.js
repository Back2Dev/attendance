import { Meteor } from 'meteor/meteor'
import Products from '../schema'

Meteor.publish('all.products', () => {
  return Products.find({ active: true })
})

Meteor.publish('product.types', () => {
  return Products.aggregate(
    [
      {
        $group: {
          _id: { type: "$type" },
          count: { $sum: 1 }
        }
      }
    ]
  )
})
