import CONSTANTS from '/imports/api/constants'

const myProducts = {
  events: [
    {
      name: 'Volunteer',
      location: 'B4H',
      when: new Date(),
      active: false,
      duration: 3,
      type: 'fallback'
    },
    {
      name: 'Half day',
      location: 'B4H',
      when: new Date(),
      active: true,
      duration: 3,
      type: 'day',
      days: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      name: 'Full day',
      location: 'B4H',
      when: new Date(),
      active: true,
      duration: 6,
      type: 'day',
      days: [0, 1, 2, 3, 4, 5, 6]
    }
  ],
  productTypes: [
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      name: 'Memberships',
      description: 'Join as a member and support our cause',
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    }
  ],
  products: [
    {
      name: '12 month membership',
      price: 50000,
      description: '12 month sponsorship',
      code: 'B4H-MEMB-12',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      subsType: 'member',
      active: true,
      autoRenew: true,
      image: '/images/membership.jpg'
    }
  ]
}

export default myProducts
