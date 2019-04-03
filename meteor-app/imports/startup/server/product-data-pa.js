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
      name: 'Casual session',
      price: 20 * 100,
      description: '1 session',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      active: true,
      image: '/images/pass.jpg'
    },
    {
      name: 'Multipass x 10',
      price: 150 * 100,
      description: '10 sessions ',
      type: CONSTANTS.PRODUCT_TYPES.PASS,
      active: true,
      autoRenew: true,
      duration: 2,
      image: '/images/pass.jpg'
    },
    {
      name: '12 month membership',
      price: 960 * 100,
      description: 'Unlimited sessions, automatic renewal every 12 months',
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      active: true,
      autoRenew: true,
      duration: 12,
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      name: '3 month Membership',
      price: 270 * 100,
      description: 'Unlimited sessions, automatic renewal every 3 months',
      active: true,
      autoRenew: true,
      duration: 3,
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    },
    {
      type: CONSTANTS.PRODUCT_TYPES.MEMBERSHIP,
      name: 'Monthly Membership',
      price: 100 * 100,
      description: 'Unlimited sessions, automatic renewal every month',
      active: true,
      duration: 1,
      autoRenew: true,
      color: 'blue',
      icon: 'cogs',
      image: '/images/membership.jpg'
    }
  ]
}

export default myProducts
