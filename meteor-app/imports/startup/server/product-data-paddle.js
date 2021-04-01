import CONSTANTS from '/imports/api/constants'

const myProducts = {
  productTypes: [
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      name: 'Memberships',
      description: 'New members welcome',
      color: 'green',
      icon: 'key',
      image: '/images/membership.jpg',
    },
  ],
  products: [
    {
      name: 'Active membership',
      price: 80 * 100,
      description: 'Active patrolling membership',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'PADDLE-ACTIVE',
      active: true,
      autoRenew: true,
      duration: 12,
      subsType: 'member',
      image: '/images/membership.jpg',
    },
    {
      name: 'Day pass',
      price: 30 * 100,
      description: '12 month casual membership, pay per visit',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      code: 'PADDLE-DAY',
      active: true,
      autoRenew: true,
      duration: 12,
      subsType: 'member',
      image: '/images/membership.jpg',
    },
  ],
  events: [
    {
      name: 'Training Session',
      location: 'Sandridge',
      when: new Date(),
      active: false,
      duration: 3,
      type: 'fallback',
    },
    {
      name: 'Club Champs',
      location: 'Sandridge',
      when: new Date(),
      active: true,
      duration: 3,
      type: 'once',
    },
    {
      name: 'Evening',
      location: 'Sandridge',
      active: true,
      duration: 2,
      type: 'day',
      days: [1, 3],
    },
    {
      name: 'Morning',
      location: 'Sandridge',
      when: new Date(),
      active: true,
      duration: 2,
      type: 'day',
      days: [2],
    },
  ],
  promos: [
    {
      code: 'SUPER-USER',
      description: 'Super special',
      discount: 0,
      admin: true,
      start: new Date(),
    },
  ],
}

export default myProducts
