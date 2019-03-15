import { Meteor } from 'meteor/meteor' // base
import Products from '/imports/api/products/schema'
import CONSTANTS from '/imports/api/constants'

const b2bProducts = [
  {
    name: 'Bicycle maintenance coursse',
    price: 36000,
    description: "6 week bicycle maintenance course",
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true
  },
  {
    name: 'Punctures session',
    price: 8000,
    description: "Week 1: Punctures",
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true
  },
  {
    name: 'Gears session',
    price: 15000,
    description: "Week 3&4: Gears",
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true
  },
  {
    name: 'Workshop session',
    price: 2000,
    description: "Evening workshop access",
    type: CONSTANTS.PRODUCT_TYPES.PASS,
    active: true
  },
  {
    name: '6 month membership',
    price: 20000,
    description: "Evening workshop access for 6 months",
    type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
    active: true
  },

]
Meteor.methods({

  'seed.products'() {
    try {
      b2bProducts.forEach(item => {
        Products.insert(item)
      })
    } catch (e) {
      console.log(e)
    }


  },
})

Meteor.startup(() => {
  if (Products.find().count() === 0) {
    Meteor.call('seed.products')
  }
})
