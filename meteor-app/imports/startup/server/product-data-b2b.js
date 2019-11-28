import CONSTANTS from '/imports/api/constants'

const b2bProducts = {
  events: [
    {
      name: 'Volunteer',
      location: 'Back2bikes',
      when: new Date(),
      active: false,
      duration: 3,
      type: 'fallback'
    },
    {
      name: 'Half day',
      location: 'Back2bikes',
      when: new Date(),
      active: true,
      duration: 3,
      type: 'day',
      days: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      name: 'Full day',
      location: 'Back2bikes',
      when: new Date(),
      active: true,
      duration: 6,
      type: 'day',
      days: [0, 1, 2, 3, 4, 5, 6]
    }
  ],
  productTypes: [
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
      description: 'Use our fully equipped workshop  to fix your bike. Get advice and help about how to do it',
      color: 'lime',
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
  ],
  products: [
    {
      name: 'Bicycle maintenance course',
      price: 36000,
      description: '6 week bicycle maintenance course',
      code: 'MAINT-ALL',
      type: CONSTANTS.PRODUCT_TYPES.COURSE,
      subsType: 'course',
      active: true,
      autoRenew: false,
      image: '/images/maintenance.jpg'
    },
    {
      name: 'Punctures session',
      price: 8000,
      description: 'Week 1: Punctures',
      code: 'MAINT-WK-1',
      type: CONSTANTS.PRODUCT_TYPES.COURSE,
      subsType: 'course',
      active: true,
      autoRenew: false,
      image: '/images/puncture.jpg'
    },
    {
      name: 'Brakes session',
      price: 8000,
      description: 'Week 2: Brakes',
      code: 'MAINT-WK-2',
      type: CONSTANTS.PRODUCT_TYPES.COURSE,
      subsType: 'course',
      active: true,
      autoRenew: false,
      image: '/images/brakes.jpg'
    },
    {
      name: 'Gears sessions (2 weeks)',
      price: 15000,
      description: 'Weeks 3 & 4: Gears',
      code: 'MAINT-WK-3',
      type: CONSTANTS.PRODUCT_TYPES.COURSE,
      subsType: 'course',
      active: true,
      autoRenew: false,
      image: '/images/gears.jpg'
    },
    {
      name: 'Wheels session',
      price: 8000,
      description: 'Week 5: Wheel bearings',
      code: 'MAINT-WK-5',
      type: CONSTANTS.PRODUCT_TYPES.COURSE,
      subsType: 'course',
      active: true,
      autoRenew: false,
      image: '/images/wheels.jpg'
    },
    {
      name: 'Forks session',
      price: 8000,
      description: 'Week 6: Forks and Bottom brackets',
      code: 'MAINT-WK-6',
      type: CONSTANTS.PRODUCT_TYPES.COURSE,
      subsType: 'course',
      active: true,
      autoRenew: false,
      image: '/images/forks.jpg'
    },
    {
      name: 'Workshop session',
      price: 2000,
      description: 'Evening workshop access',
      code: 'PASS-GEN',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      subsType: 'pass',
      active: true,
      autoRenew: false,
      image: '/images/workshop.jpg'
    },
    {
      name: "Women's workshop session",
      price: 2000,
      description: "Evening workshop access (women's nights)",
      code: 'PASS-WOM',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      subsType: 'pass',
      active: true,
      autoRenew: false,
      image: '/images/womens.jpg'
    },
    {
      name: '1 month membership',
      price: 4000,
      description: 'Evening workshop access for 1 months',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'MEMB-1',
      subsType: 'member',
      active: true,
      autoRenew: true,
      duration: 1,
      image: '/images/bicycle-membership.jpg'
    },
    {
      name: '3 month membership',
      price: 20000,
      description: 'Evening workshop access for 3 months',
      code: 'MEMB-3',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      subsType: 'member',
      active: true,
      autoRenew: true,
      image: '/images/membership.jpg'
    },
    {
      name: '12 month membership',
      price: 50000,
      description: 'Evening workshop access for 12 months',
      code: 'MEMB-12',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      subsType: 'member',
      active: true,
      autoRenew: true,
      image: '/images/membership.jpg'
    }
  ]
}

export default b2bProducts
