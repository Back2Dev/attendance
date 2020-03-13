import CONSTANTS from '/imports/api/constants'

const myProducts = {
  productTypes: [
    {
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      name: 'Multi pass',
      description: 'Multiple visit pass',
      color: 'orange',
      icon: 'heart',
      image: '/images/pass.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      name: 'Memberships',
      description: 'Join as a member, get unlimited access',
      color: 'green',
      icon: 'key',
      image: '/images/membership.jpg'
    }
  ],
  products: [
    {
      name: 'PA Casual signup',
      price: 0,
      description: 'Pay $0 now, automatic payment of $20 when you attend',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      code: 'PA-CASUAL-SIGNUP',
      autoRenew: true,
      active: true,
      qty: 1,
      subsType: 'casual',
      image: '/images/pass.jpg'
    },
    {
      name: 'PA Casual session',
      price: 20 * 100,
      description: '1 session',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      code: 'PA-CASUAL',
      autoRenew: true,
      active: true,
      duration: 2,
      qty: 1,
      subsType: 'casual',
      image: '/images/pass.jpg'
    },
    {
      name: 'PA Multipass x 10',
      price: 150 * 100,
      description: '10 sessions ',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      code: 'PA-PASS-MULTI-10',
      active: true,
      qty: 10,
      autoRenew: true,
      duration: 2,
      subsType: 'pass',
      image: '/images/pass.jpg'
    },
    {
      name: 'PA 12 month membership',
      price: 960 * 100,
      description: 'Unlimited sessions, automatic renewal every 12 months',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'PA-MEMB-12',
      active: true,
      autoRenew: true,
      duration: 12,
      subsType: 'member',
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'PA-MEMB-3',
      name: 'PA 3 month Membership',
      price: 270 * 100,
      description: 'Unlimited sessions, automatic renewal every 3 months',
      active: true,
      autoRenew: true,
      duration: 3,
      subsType: 'member',
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'PA-MEMB-1',
      name: 'PA Monthly Membership',
      price: 100 * 100,
      description: 'Unlimited sessions, automatic renewal every month',
      active: true,
      duration: 1,
      subsType: 'member',
      autoRenew: true,
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'SLSC-MEMB-ACTIVE',
      name: 'SLSC Active Membership',
      price: 75 * 100,
      description: 'Sandridge Active Patrolling Membership',
      active: true,
      duration: 12,
      subsType: 'member',
      autoRenew: false,
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'SLSC-MEMB-ASSOC',
      name: 'SLSC Associate Membership',
      price: 120 * 100,
      description: 'Sandridge Associate Membership',
      active: true,
      duration: 12,
      subsType: 'member',
      autoRenew: false,
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'SLSC-MEMB-CADET',
      name: 'SLSC Cadet Membership',
      price: 75 * 100,
      description: 'Sandridge Junior/Cadet Patrolling Membership',
      active: true,
      duration: 12,
      subsType: 'member',
      autoRenew: false,
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'SLSC-MEMB-FAMILY',
      name: 'SLSC Family Membership',
      price: 30 * 100,
      description: 'Sandridge Family Membership, (2 adults, 2 kids U17)',
      active: false,
      duration: 12,
      subsType: 'member',
      autoRenew: false,
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    }
  ],
  events: [
    {
      name: 'Training Session',
      location: 'Sandridge',
      when: new Date(),
      active: false,
      duration: 3,
      type: 'fallback'
    },
    {
      name: 'Club Champs',
      location: 'Sandridge',
      when: new Date(),
      active: true,
      duration: 3,
      type: 'once'
    },
    {
      name: 'Group Kayak',
      location: 'Sandridge',
      when: new Date(),
      active: true,
      duration: 2,
      type: 'day',
      days: [1, 2, 3, 4, 6]
    },
    {
      name: 'SAS Squad',
      location: 'Sandridge',
      when: new Date(),
      active: true,
      duration: 2,
      type: 'day',
      days: [3, 5]
    },
    {
      name: 'Paddle Bootcamp',
      location: 'Sandridge',
      when: new Date(),
      active: true,
      duration: 2,
      type: 'day',
      days: [5]
    },
    {
      name: 'Paddle Bootcamp',
      location: 'Sandridge',
      when: new Date(),
      active: true,
      duration: 2,
      type: 'day',
      days: [5]
    }
  ],
  promos: [
    { code: 'PA-10-PERCENT', description: '10% off', discount: 10, admin: false, start: new Date() },
    {
      code: 'PA-SEPTEMBER',
      description: 'September 15% Special',
      discount: 15,
      admin: false,
      start: new Date(),
      expires: new Date('2019-9-30')
    },
    { code: 'JARAD-ROOLS', description: "Jarad's special", discount: 0, admin: true, start: new Date() }
  ]
}

export default myProducts
