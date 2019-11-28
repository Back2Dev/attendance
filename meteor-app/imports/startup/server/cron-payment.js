// cron-jobs.js
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

// import { eventLog } from '/imports/api/eventlogs'
// import log from '/imports/lib/log'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Members, { pinAddressFieldMap } from '/imports/api/members/schema'

const cron = require('node-cron')
const debug = require('debug')('b2b:cron')

Meteor.methods({
  findMemberCart(memberId) {
    const monthAgo = moment()
      .subtract(30, 'day')
      .toDate()
    const cartQuery = {
      memberId,
      status: 'ready',
      price: { $gt: 0 },
      createdAt: { $gt: monthAgo }
    }
    const carts = Carts.find(cartQuery, { sort: { createdAt: -1 } }).fetch()
    if (carts.length > 0) {
      return carts[0]
    } else {
      // Couldn't find a cart - look for the last purchase and use that
      const purchases = Purchases.find({ memberId }, { sort: { createdAt: -1 } }).fetch()
      if (purchases.length === 0) return null
      const purchase = purchases[0] // take the most recent one
      const product = Products.findOne(purchase.productId)
      if (product) {
        delete product.createdAt
        delete product.updatedAt
        const newCart = {
          memberId,
          price: purchase.price,
          totalqty: 1,
          products: [product],
          prodqty: {
            [product._id]: 1
          },
          status: 'ready'
        }
        const cartId = Carts.insert(newCart)
        debug(`cart found ${cartId}`, Carts.findOne(cartId))
        return Carts.findOne(cartId)
      } else {
        debug(`Could not find a previous purchase or product for ${memberId}`)
        throw new Meteor.Error('No PRODUCT ') // Like BREXIT, it's a NO DEAL CRASHOUT !!!
      }
    }
  },

  autoPayNotice() {
    // Send Advance notice of auto-payment
    const query = {
      autoPay: true,
      subsType: 'member',
      paymentCustId: { $exists: true }
    }
    debug('Search for ', query)
    Members.find(query).forEach(member => {
      // Expiring within the next 3 days?
      const expiry = moment(member.expiry)
      debug(`${member.name} expires ${member.expiry}`)
      if (expiry.isAfter(new Date()) && expiry.subtract(3, 'day').isBefore(new Date())) {
        // Membership has expired... find/create a shopping cart for them to use
        const cart = Meteor.call('findMemberCart', member._id)
        const amount = `${cart.price / 100}.00`
        debug(`autoPayNotice for ${member.name} ${member.email}`)
        Meteor.call(
          'sendGenericInfoEmail',
          member.email,
          {
            subject: 'Automatic payment due soon',
            name: member.name,
            message: `We will charge ${amount} your credit card on ${expiry.format('DD/MM/YYYY')}.

No action is required, as you have elected to pay automatically, and we have your card details on file`,
            headline: `Automatic membership renewal`
          },
          Meteor.settings.private.genericInfoID
        )
        Members.update(member._id, { $set: { autoPayNoticeDate: new Date() } })
      }
    })
  },

  autoPayment() {
    // Make auto-payments when expired, and send email
    const query = {
      autoPay: true,
      subsType: 'member',
      paymentCustId: { $exists: true },
      status: 'expired'
    }
    Members.find(query).forEach(member => {
      // Expiring today?
      const expiry = moment(member.expiry)
      if (expiry.isAfter(new Date())) {
        //TODO: Prime a shopping cart first
        const packet = {
          amount: price.toString(),
          currency: 'AUD',
          description: 'Purchase',
          email,
          metadata: { cartId, codes }
        }
        const result = Meteor.call('makePayment', packet)
        Meteor.call(
          'sendGenericInfoEmail',
          member.email,
          {
            subject: 'Automatic remembership renewal complete',
            name: member.name,
            message: 'No action required as ',
            headline: 'Read all about it!'
          },
          Meteor.settings.private.genericInfoID
        )
      }
    })

    try {
    } catch (error) {
      console.error(`Error ${error.message} encountered while checking memberships`)
    }
  },

  retireOldCarts() {
    const CART_RETIREMENT_AGE = 30
    try {
      const retirementDate = moment()
        .subtract(CART_RETIREMENT_AGE, 'day')
        .toDate()
      const cartQuery = {
        status: 'ready',
        updatedAt: { $lt: retirementDate }
      }
      const n = Carts.remove(cartQuery)
      debug(`retired ${n} unused shopping carts older than ${CART_RETIREMENT_AGE} days`)
      return n
    } catch (error) {
      console.error(`Error ${error.message} encountered while retiring unused shopping carts`)
    }
  }
})

// This will run daily to check for expiring subscriptions etc
const membershipTicker = () => {
  // debug(`Membership ticker`)
  // Update status values
  Meteor.call('updateMemberStatusAll')

  // Update subs type for all
  Meteor.call('updateSubsTypeAll')

  // Update 'remaining visits'
  Meteor.call('updateRemainingAll')

  // Send out the following emails:
  // - Advance notice of auto-payment
  // - Auto-payment has been made
  // - Your membership has expired - please renew

  // Retire old shopping carts - TESTS OK
  Meteor.call('retireOldCarts')

  // Warn of payments within 3 days'
  Meteor.call('autoPayNotice')

  // Auto-payment has been made'
  Meteor.call('autoPayment')
}
//
// These are cron-style time specifiers
//
//                       ┌───────────── minute (0 - 59)
//                       │ ┌───────────── hour (0 - 23)
//                       │ │ ┌───────────── day of month (1 - 31)
//                       │ │ │ ┌───────────── month (1 - 12)
//                       │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
//                       │ │ │ │ │                                       7 is also Sunday on some systems)
//                       │ │ │ │ │
//                       │ │ │ │ │
//                       * * * * *

const MEMBERSHIP_TICKER_INTERVAL = '5 6 * * *'
// const MEMBERSHIP_TICKER_INTERVAL = '* * * * *'

Meteor.startup(() => {
  cron.schedule(MEMBERSHIP_TICKER_INTERVAL, Meteor.bindEnvironment(membershipTicker))
})
