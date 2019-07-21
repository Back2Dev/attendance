// cron-jobs.js
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

import { eventLog } from '/imports/api/eventlogs'
import log from '/imports/lib/log'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Members, { pinAddressFieldMap } from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'

const cron = require('node-cron')
const debug = require('debug')('b2b:cron')

Meteor.methods({
  //----------
  // Send membership renewals, assumes that shopping carts have been pre-filled
  sendMembershipRenewals(name) {
    const query = name ? { name } : {}
    Members.find(query).forEach(member => {
      debug(`Checking ${member.name}`)
      // Purchases.find({
      //   memberId: member._id,
      //   code: '/PA-MEMB/',
      //   expiry: { $lt: new Date() }
      // }).forEach(purchase => {
      Carts.find({ memberId: member._id, status: 'ready' }).forEach(cart => {
        cart.products
          .filter(product => product.code.match(/-MEMB-/))
          .forEach(product => {
            debug(`Sending email for ${product.code} to ${member.name}, `)
            Meteor.call(
              'sendMembershipEmail',
              member.email,
              member.name,
              product.name,
              moment(member.expiry).format('Do MMM YYYY'),
              `renew/${member._id}/${cart._id}`,
              Meteor.settings.private.expiredMembershipID
            )
            debug('Sending Membership Renewal to ' + member.email)
          })
      })
    })
  },

  // Send membership reminder email (by name)
  sendMembershipReminderEmail(name) {
    const query = name ? { name } : {}
    Members.find(query).forEach(member => {
      Purchases.find({
        memberId: member._id,
        code: /-MEMB-/,
        expiry: { $gt: new Date() }
      }).forEach(purchase => {
        Meteor.call(
          'sendMembershipEmail',
          member.email,
          member.name,
          purchase.productName,
          moment(purchase.expiry).format('Do MMM YYYY'),
          Meteor.settings.private.validMembershipID
        )
        debug('Sending Membership reminder to ' + member.email)
      })
    })
  },

  // Send pass renewal email
  sendPassRenewal() {
    Members.find({ $where: 'this.sessions.length >=5' }).forEach(member => {
      Purchases.find({
        memberId: member._id,
        code: /-PASS-/,
        expiry: { $lt: new Date() }
      }).forEach(p => {
        debug(p.purchaser + ' has expired PASS... Sending Renewal Email.')
      })
      Purchases.find({
        memberId: member._id,
        code: /-PASS-/,
        expiry: { $gt: new Date() }
      }).forEach(p => {
        debug(p.purchaser + ' has valid PASS.... Sending Reminder Email')
      })
    })
  },

  // update member status
  updateMemberStatus(memberId, status) {
    try {
      Members.update(
        { _id: memberId },
        {
          $set: {
            status
          }
        }
      )
    } catch (e) {
      debug(e)
    }
  },

  // Update subscription type
  updatesubsType(memberId, type) {
    try {
      Members.update(
        { _id: memberId },
        {
          $set: {
            subsType: type
          }
        }
      )
    } catch (e) {
      debug(e)
    }
  },

  // update Remaining visits
  updateRemaining(memberId, remainingVisits) {
    try {
      Members.update(
        { _id: memberId },
        {
          $set: {
            remaining: remainingVisits
          }
        }
      )
    } catch (e) {
      debug(e)
    }
  },

  // Update status values
  updateMemberStatusAll() {
    try {
      Members.find({}).forEach(member => {
        Purchases.find({
          memberId: member._id,
          expiry: { $lt: new Date() }
        }).forEach(purchase => {
          debug(`Member ${member.name} is expired (${purchase.expiry})`)
          Members.update(
            { _id: purchase.memberId },
            {
              $set: {
                status: 'expired',
                expiry: purchase.expiry,
                remaining: 0
              }
            }
          )
        })
        Purchases.find({
          memberId: member._id,
          expiry: { $gt: new Date() }
        }).forEach(purchase => {
          debug(`Member ${member.name} is current, expiring (${purchase.expiry})`)
          Members.update(
            { _id: purchase.memberId },
            {
              $set: {
                status: 'current',
                expiry: purchase.expiry
              }
            }
          )
        })
      })
      Members.update({ status: null }, { $set: { status: 'expired' } }, { multi: true })
      const stats = Members.find({})
        .fetch()
        .reduce((acc, member) => {
          acc[member.status] = acc[member.status] ? acc[member.status] + 1 : 1
          return acc
        }, {})
      debug('Member status: ', stats)
    } catch (e) {
      debug(e)
    }
  },

  // Update subs type for all
  updateSubsTypeAll() {
    try {
      Purchases.find({ code: /-PASS-/ }).forEach(purchase => {
        debug(`Member ${purchase.memberId} ${purchase.purchaser} pass: ${purchase.code}`)
        Members.update(purchase.memberId, {
          $set: {
            subsType: 'pass'
          }
        })
      })
      Purchases.find({ code: /-MEMB-/ }).forEach(purchase => {
        debug(`Member ${purchase.purchaser} member: ${purchase.code}`)
        Members.update(purchase.memberId, {
          $set: {
            subsType: 'member'
          }
        })
      })
      Purchases.find({ code: 'PA-PASS-CASUAL' }).forEach(purchase => {
        debug(`Member ${purchase.purchaser} casual: ${purchase.code}`)
        Members.update(purchase.memberId, {
          $set: {
            subsType: 'casual'
          }
        })
      })
      Members.find({ subsType: null }).forEach(member => {
        debug(`!!! Member ${member.name} substype is unknown: setting to casual`)
        Members.update(member._id, {
          $set: {
            subsType: 'casual'
          }
        })
      })
    } catch (e) {
      debug(e)
    }
    const stats = Members.find({})
      .fetch()
      .reduce((acc, member) => {
        acc[member.subsType] = acc[member.subsType] ? acc[member.subsType] + 1 : 1
        return acc
      }, {})
    debug('Member subs types: ', stats)
  },

  // Update 'remaining visits'
  updateRemainingAll() {
    Members.find({ subsType: 'pass', status: 'current' }).forEach(member => {
      Purchases.find({ memberId: member._id }).forEach(purchase => {
        remaining = (purchase.qty || 1) - member.sessionCount
      })
      debug(`Current member update ${member.name} remaining: ${remaining}`)
      Members.update(member._id, { $set: { remaining } })
    })
    Members.find({ subsType: 'pass', status: 'expired' }).forEach(member => {
      Purchases.find({ memberId: member._id }).forEach(purchase => {
        if (member.sessionCount == 0) {
          remaining = 0
        } else {
          remaining = (purchase.qty || 1) - member.sessionCount
        }
      })
      debug(`Expired member update ${member.name} remaining: ${remaining}`)
      Members.update({ _id: member._id }, { $set: { remaining } })
    })
    Members.find({
      $or: [{ subsType: 'member' }, { subsType: 'casual' }]
    }).forEach(member => {
      Members.update({ _id: member._id }, { $set: { remaining: 0 } })
    })
    const stats = Members.find({})
      .fetch()
      .reduce((acc, member) => {
        acc[member.remaining] = acc[member.remaining] ? acc[member.remaining] + 1 : 1
        return acc
      }, {})
    debug('Member remaining: ', stats)
  },

  // NOT USED?
  // getMembersByStatus(status) {
  //   Members.find({ status: status }).forEach(member => {
  //     debug(member.name)
  //   })
  // },
  // getMembersBySubsType(subsType) {
  //   Members.find({ subsType: subsType }).forEach(member => {
  //     debug(member.name)
  //   })
  // },

  // Create shopping cart entries for previous offenders,
  // - only applicable to non-casuals who have expired
  primeRenewals() {
    debug(`Deleted ${Carts.remove({ status: 'ready' })} carts`)
    let newCarts = 0
    Purchases.find({}).forEach(purchase => {
      const member = Members.findOne(purchase.memberId)
      if (!member) {
        console.error(`Could not find member ${purchase.purchaser} with id: ${purchase.memberId}`)
      } else {
        const carts = Carts.find({ memberId: member._id, status: 'ready' })
        if (carts.length > 0) {
          debug(`${member.name} has a cart already`)
        } else {
          if (member.status === 'expired' && member.subsType !== 'casual') {
            const product = Products.findOne(purchase.productId)
            if (!product) {
              console.error(
                `Could not find product to match previous purchase ${purchase.productName} ${purchase.productId}`
              )
            } else {
              product.qty = 1
              if (product.code.match(/-PASS-/) && member.remaining < 0) {
                product.qty = product.qty + (-member.remaining % 10)
              }
              const creditCard = {}
              Object.keys(pinAddressFieldMap).forEach(key => {
                creditCard[key] = member[pinAddressFieldMap[key]]
              })
              if (!creditCard.address_country) {
                creditCard.address_country = 'Australia'
              }
              const cart = {
                memberId: member._id,
                email: member.email,
                customerName: member.name,
                products: [product],
                price: product.price,
                totalqty: product.qty,
                prodqty: { [purchase.productId]: product.qty },
                creditCard,
                status: 'ready'
              }
              const cartId = Carts.insert(cart)
              debug(`Added cart for ${member.name} ${member.status} ${member.subsType}`)
              newCarts++
            }
          }
        }
      }
    })
    debug(`Created ${newCarts} carts`)
  }
})

const signoutTicker = () => {
  const hour = moment().hour()
  debug(`Tick ${hour}:00`)

  try {
    let n = 0
    crew = Members.find({ isHere: true })
    crew.forEach(dude => {
      const stillHereQuery = {
        memberId: dude._id
      }
      debug('stillHereQuery', stillHereQuery)
      Sessions.find(stillHereQuery, {
        sort: { createdAt: -1 },
        limit: 1
      }).forEach(session => {
        if (
          moment()
            .utc()
            .isAfter(moment(session.timeOut).utc())
        ) {
          debug(`Automatically signed out ${dude.name}`)
          n += Members.update(dude._id, { $set: { isHere: false } })
        }
      })
    })
    if (n) {
      debug(`Signed out ${n} members`)
    }
  } catch (error) {
    console.error(`Error ${error.message} encountered signing members out`)
  }
}

// This will run daily to check for expiring subscriptions etc
const membershipTicker = () => {
  debug(`Membership ticker`)

  try {
  } catch (error) {
    console.error(`Error ${error.message} encountered while checking memberships`)
  }
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

const SIGNOUT_TICKER_INTERVAL = '1,16,31,46 * * * *'
const MEMBERSHIP_TICKER_INTERVAL = '5 6 * * *'

Meteor.startup(() => {
  cron.schedule(SIGNOUT_TICKER_INTERVAL, Meteor.bindEnvironment(signoutTicker))
  cron.schedule(MEMBERSHIP_TICKER_INTERVAL, Meteor.bindEnvironment(membershipTicker))
})
