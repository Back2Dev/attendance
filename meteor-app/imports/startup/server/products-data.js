import { Meteor } from 'meteor/meteor' // base
import Products, { ProductTypes } from '/imports/api/products/schema'
import CONSTANTS from '/imports/api/constants'

const productTypes = [
  {
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    name: 'Maintenance Courses',
    description: 'We offer maintenance courses, you can learn to repair your bike yourself',
    color: 'orange',
    icon: 'wrench',
    image: '/images/maintenance.jpg'
  },
  {
    type: CONSTANTS.PRODUCT_TYPES.PASS,
    name: 'Workshop time',
    description: 'Use our fully equipped workshop to fix your bike. Get advice and help about how to do it',
    color: 'green',
    icon: 'cog',
    image: '/images/workshop.jpg'
  },
  {
    type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
    name: 'Memberships',
    description: 'Join as a member, get access to discounts and workshop time',
    color: 'blue',
    icon: 'cogs',
    image: '/images/membership.jpg'
  }
]
const b2bProducts = [
  {
    name: 'Bicycle maintenance course',
    price: 36000,
    description: '6 week bicycle maintenance course',
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true,
    image: '/images/maintenance.jpg'
  },
  {
    name: 'Punctures session',
    price: 8000,
    description: 'Week 1: Punctures',
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true,
    image: '/images/puncture.jpg'
  },
  {
    name: 'Brakes session',
    price: 8000,
    description: 'Week 2: Brakes',
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true,
    image: '/images/brakes.jpg'
  },
  {
    name: 'Gears sessions (2 weeks)',
    price: 15000,
    description: 'Weeks 3 & 4: Gears',
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true,
    image: '/images/gears.jpg'
  },
  {
    name: 'Wheels session',
    price: 8000,
    description: 'Week 5: Wheel bearings',
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true,
    image: '/images/wheels.jpg'
  },
  {
    name: 'Forks session',
    price: 8000,
    description: 'Week 6: Forks and Bottom brackets',
    type: CONSTANTS.PRODUCT_TYPES.COURSE,
    active: true,
    image: '/images/forks.jpg'
  },
  {
    name: 'Workshop session',
    price: 2000,
    description: 'Evening workshop access',
    type: CONSTANTS.PRODUCT_TYPES.PASS,
    active: true,
    image: '/images/workshop.jpg'
  },
  {
    name: "Women's workshop session",
    price: 2000,
    description: "Evening workshop access (women's nights)",
    type: CONSTANTS.PRODUCT_TYPES.PASS,
    active: true,
    image: '/images/womens.jpg'
  },
  {
    name: '1 month membership',
    price: 4000,
    description: 'Evening workshop access for 6 months',
    type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
    active: true,
    image: '/images/bicycle-membership.jpg'
  },
  {
    name: '3 month membership',
    price: 20000,
    description: 'Evening workshop access for 6 months',
    type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
    active: true,
    image: '/images/membership.jpg'
  },
  {
    name: '12 month membership',
    price: 40000,
    description: 'Evening workshop access for 6 months',
    type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
    active: true,
    image: '/images/membership.jpg'
  }
]
Meteor.methods({
  'seed.products': function() {
    try {
      b2bProducts.forEach(item => {
        Products.insert(item)
      })
    } catch (e) {
      console.log(e)
    }
  },
  'seed.productTypes': function() {
    try {
      productTypes.forEach(item => {
        ProductTypes.insert(item)
      })
    } catch (e) {
      console.log(e)
    }
  }
})

Meteor.startup(() => {
  if (Products.find().count() === 0) {
    Meteor.call('seed.products')
  }
  if (ProductTypes.find().count() === 0) {
    Meteor.call('seed.productTypes')
  }
})
