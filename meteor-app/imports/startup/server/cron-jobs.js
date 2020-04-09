// cron-jobs.js
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

// import { eventLog } from '/imports/api/eventlogs'
// import log from '/imports/lib/log'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Members, { pinAddressFieldMap } from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'

const cron = require('node-cron')
const debug = require('debug')('b2b:cron')

Meteor.methods({
  // cartId is optional, if null, do all carts, otherwise just do that one cart
  // TESTED
  reconcileCompletedCarts(cartId) {
    let n = 0
    try {
      const query = cartId ? { _id: cartId } : { status: 'complete', memberId: { $exists: false } }
      debug(`reconcile ${cartId} `, query)
      Carts.find(query).forEach(cart => {
        const email = cart.creditCard.email || cart.chargeResponse.email
        debug(`Reconciling completed cart ${cart._id} ${email} ${cart.products.map(p => p.code).join()} ${cart.price}`)
        const lcem = email.toLowerCase()
        const mQuery = { $or: [{ email: lcem }, { paymentEmails: lcem }] }
        const members = Members.find(mQuery).fetch()
        if (members.length === 0) throw new Meteor.Error(`Could not find a member with email ${email}`)
        if (members.length > 1) throw new Meteor.Error(`More than one member with the email ${email}`)
        if (members.length === 1) {
          debug(`Found member [${members[0].name}]`)
          const sub = cart.products[0]
          sub.txnDate = cart.chargeResponse.created_at
          sub.purchaser = members[0].name
          sub.productId = cart.products[0]._id
          sub.productName = cart.products[0].name
          sub.paymentMethod = 'credit'
          sub.status = 'complete'
          sub.memberId = members[0]._id
          sub.qty = cart.prodqty[cart.products[0]._id] || 1

          delete sub._id
          if (sub.type === 'membership') {
            const purchaseDate = moment(cart.chargeResponse.created_at)
            // Find the last expiring purchase:
            const purchases = Purchases.find({ memberId: members[0]._id }, { sort: { expiry: -1 } }).fetch()
            const expiry =
              purchases.length && purchases[0].expiry && purchaseDate.isBefore(purchases[0].expiry, 'day')
                ? moment(purchases[0].expiry)
                : purchaseDate
            sub.expiry = expiry.add(sub.duration, 'month').toISOString()
          }
          if (sub.type === 'pass') {
            sub.expiry = moment(cart.chargeResponse.created_at)
              .add(sub.duration, 'month')
              .toISOString()
          }

          // Need to check if purchases exist here already
          Purchases.insert(sub)
          n =
            n +
            Carts.update(cart._id, {
              $set: {
                memberId: members[0]._id,
                email: members[0].email,
                customerName: members[0].name,
                paymentMethod: 'credit card'
              }
            })
          // Save the customer token to the member record as well:
          Members.update(members[0]._id, { $set: { paymentCustId: cart.chargeResponse.customerToken } })
        }
      })
    } catch (e) {
      return { status: 'failed', message: e.message }
    }
    return { status: 'success', message: `Matched ${n} cart(s)` }
  },

  //----------
  // Send membership renewals, assumes that shopping carts have been pre-filled
  sendMembershipRenewals(name) {
    const query = name ? { name } : {}
    Members.find(query).forEach(member => {
      // debug(`Checking ${member.name}`)
      // Purchases.find({
      //   memberId: member._id,
      //   code: '/PA-MEMB/',
      //   expiry: { $lt: new Date() }
      // }).forEach(purchase => {
      Carts.find({ memberId: member._id, status: 'ready' }).forEach(cart => {
        cart.products
          .filter(product => product.code.match(/-MEMB-/))
          .forEach(product => {
            // debug(`Sending email for ${product.code} to ${member.name}, `)
            Meteor.call(
              'sendMembershipEmail',
              member.email,
              member.name,
              product.name,
              moment(member.expiry).format('Do MMM YYYY'),
              `renew/${member._id}/${cart._id}`,
              Meteor.settings.private.expiredMembershipID
            )
            // debug('Sending Membership Renewal to ' + member.email)
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
          `renew/${member._id}/${cart._id}`,
          Meteor.settings.private.validMembershipID
        )
        // debug('Sending Membership reminder to ' + member.email)
      })
    })
  },

  //----------
  // Send pass renewals, assumes that shopping carts have been pre-filled
  sendPassRenewals(name) {
    const query = name ? { name } : {}
    Members.find(query).forEach(member => {
      // debug(`Checking ${member.name}`)
      Carts.find({ memberId: member._id, status: 'ready' }).forEach(cart => {
        cart.products
          .filter(product => product.code.match(/-PASS-/))
          .forEach(product => {
            if (!member.email) {
              console.log(`No email address found for ${member.name}`)
            } else {
              // debug(`Sending email for ${product.code} to ${member.name}, ${member.email}`)
              Meteor.call(
                'sendPassEmail',
                member.email,
                member.name,
                moment(member.expiry).format('Do MMM YYYY'),
                `renew/${member._id}/${cart._id}`,
                Meteor.settings.private.expiredPassID
              )
              debug('Sending Pass Renewal to ' + member.email)
            }
          })
      })
    })
  },

  //----------
  // Send casual registrations, assumes that shopping carts have been pre-filled
  sendCasualRenewals(name) {
    const query = name ? { name } : {}
    Members.find(query).forEach(member => {
      debug(`Checking ${member.name}`)
      Carts.find({ memberId: member._id, status: 'ready' }).forEach(cart => {
        cart.products
          .filter(product => product.code.match(/-CASUAL-SIGNUP/))
          .forEach(product => {
            if (!member.email) {
              console.log(`No email address found for ${member.name}`)
            } else {
              debug(`Sending email for ${product.code} to ${member.name},  ${member.email} `)
              Meteor.call(
                'sendPassEmail',
                member.email,
                member.name,
                moment(member.expiry).format('Do MMM YYYY'),
                `renew/${member._id}/${cart._id}`,
                Meteor.settings.private.registerCardID
              )
            }
          })
      })
    })
  },

  // // update member status NOT USED?
  // updateMemberStatus(memberId, status) {
  //   try {
  //     Members.update(
  //       { _id: memberId },
  //       {
  //         $set: {
  //           status
  //         }
  //       }
  //     )
  //   } catch (e) {
  //     debug(e)
  //   }
  // },

  // // Update subscription type NOT USED?
  // updatesubsType(memberId, type) {
  //   try {
  //     Members.update(
  //       { _id: memberId },
  //       {
  //         $set: {
  //           subsType: type
  //         }
  //       }
  //     )
  //   } catch (e) {
  //     debug(e)
  //   }
  // },

  // update Remaining visits NOT USED?
  // updateRemaining(memberId, remainingVisits) {
  //   try {
  //     Members.update(
  //       { _id: memberId },
  //       {
  //         $set: {
  //           remaining: remainingVisits
  //         }
  //       }
  //     )
  //   } catch (e) {
  //     debug(e)
  //   }
  // },

  // Update status values
  // TESTED
  updateMemberStatusAll() {
    try {
      Members.find({}).forEach(member => {
        //
        // Look for expired purchases
        //
        Purchases.find({
          memberId: member._id,
          expiry: { $lt: new Date() }
        }).forEach(purchase => {
          // debug(`Member ${member.name} is expired (${purchase.expiry})`)
          Members.update(purchase.memberId, {
            $set: {
              status: 'expired',
              expiry: purchase.expiry,
              remaining: 0
            }
          })
        })
        //
        // Look for current purchases
        //
        Purchases.find({
          memberId: member._id,
          expiry: { $gt: new Date() }
        }).forEach(purchase => {
          // debug(`Member ${member.name} is current, expiring (${purchase.expiry})`)
          Members.update(purchase.memberId, {
            $set: {
              status: 'current',
              expiry: purchase.expiry
            }
          })
        })
      })
      //
      // Collect some counters of membership status
      //
      Members.update({ status: null }, { $set: { status: 'expired' } }, { multi: true })
      const stats = Members.find({})
        .fetch()
        .reduce((acc, member) => {
          acc[member.status] = acc[member.status] ? acc[member.status] + 1 : 1
          return acc
        }, {})
      // debug('Member status: ', stats)
    } catch (e) {
      debug(e)
    }
  },

  // Update subs type for all
  updateSubsTypeAll() {
    try {
      Purchases.find({ code: /-PASS-/ }).forEach(purchase => {
        // debug(`Member ${purchase.memberId} ${purchase.purchaser} pass: ${purchase.code}`)
        Members.update(purchase.memberId, {
          $set: {
            subsType: 'pass'
          }
        })
      })
      Purchases.find({ code: /-MEMB-/ }).forEach(purchase => {
        // debug(`Member ${purchase.purchaser} member: ${purchase.code}`)
        Members.update(purchase.memberId, {
          $set: {
            subsType: 'member'
          }
        })
      })
      Purchases.find({ code: /-CASUAL/ }).forEach(purchase => {
        // debug(`Member ${purchase.purchaser} casual: ${purchase.code}`)
        Members.update(purchase.memberId, {
          $set: {
            subsType: 'casual',
            status: 'current'
          }
        })
      })
      Members.find({ subsType: { $in: [null, 'casual'] } }).forEach(member => {
        // debug(`!!! Member ${member.name} substype is unknown: setting to casual`)
        Members.update(member._id, {
          $set: {
            subsType: 'casual',
            status: 'current'
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
    // debug('Member subs types: ', stats)
  },

  // Update 'remaining visits'
  updateRemainingAll() {
    Members.find({ subsType: 'pass', status: 'current' }).forEach(member => {
      Purchases.find({ memberId: member._id }).forEach(purchase => {
        const product = Products.findOne(purchase.productId)
        if (!product) throw new Meteor.Error(`Product ${purchase.productId} not found`)
        remaining = (product.qty || 1) * (purchase.qty || 1) - member.sessionCount
        status = remaining > 0 ? 'current' : 'expired'
      })
      // debug(`Current member update ${member.name} remaining: ${remaining}`)
      Members.update(member._id, { $set: { remaining, status } })
    })
    Members.find({ subsType: 'pass', status: 'expired' }).forEach(member => {
      Purchases.find({ memberId: member._id }).forEach(purchase => {
        const product = Products.findOne(purchase.productId)
        if (!product) throw new Meteor.Error(`Product ${purchase.productId} not found`)
        if (member.sessionCount === 0) {
          remaining = 0
        } else {
          remaining = (product.qty || 1) * (purchase.qty || 1) - member.sessionCount
        }
      })
      // debug(`Expired member update ${member.name} remaining: ${remaining}`)
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

  //
  // Prime shopping carts for casuals
  //
  primeCasuals() {
    let newCarts = 0
    // debug(`Deleted ${Carts.remove({ status: 'ready', 'products.code': /CASUAL/ })} carts`)
    const product = Products.findOne({ code: 'PA-CASUAL-SIGNUP' })
    if (!product) throw new Error('Could not find product for PA-CASUAL-SIGNUP')
    Members.find({ subsType: 'casual' }).forEach(m => {
      const creditCard = {}
      Object.keys(pinAddressFieldMap).forEach(key => {
        creditCard[key] = m[pinAddressFieldMap[key]]
      })
      if (!creditCard.address_country) {
        creditCard.address_country = 'Australia'
      }
      const cart = {
        memberId: m._id,
        email: m.email,
        customerName: m.name,
        products: [product],
        price: product.price,
        totalqty: 1,
        prodqty: { [product._id]: 1 },
        creditCard,
        status: 'ready'
      }
      const cartId = Carts.insert(cart)
      // debug(`Added cart for ${m.name} ${m.status} ${m.subsType}`)
      newCarts++
    })
  },

  primeMemberRenewal(purchaseId, memberId) {
    const member = Members.findOne(memberId)
    if (!member) {
      console.error('Could not find member ' + memberId)
      return 0
    }
    const purchase = Purchases.findOne(purchaseId)
    if (!purchase) {
      console.error('Could not find purchase ' + purchaseId)
      return 0
    }
    if (member.status === 'expired' && member.subsType !== 'casual') {
      const product = Products.findOne(purchase.productId)
      if (!product) {
        console.error(`Could not find product to match previous purchase ${purchase.productName} ${purchase.productId}`)
      } else {
        let newQty = 1
        if (product.code.match(/-PASS-/) && member.remaining < 0) {
          newQty = newQty + Math.floor(Math.abs(member.remaining) / 10)
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
          totalqty: newQty,
          prodqty: { [purchase.productId]: newQty },
          creditCard,
          status: 'ready'
        }
        const cartId = Carts.insert(cart)
        debug(`Added cart for ${member.name} ${member.status} ${member.subsType}`)
        return 1
      }
    }
    return 0
  },

  // Create shopping cart entries for previous offenders,
  // - only applicable to non-casuals who have expired
  primeRenewals() {
    // debug(`Deleted ${Carts.remove({ status: 'ready' })} carts`)
    let newCarts = 0
    //TODO: be smarter about this, only the last purchase for each member should be primed
    Purchases.find({}).forEach(purchase => {
      const member = Members.findOne(purchase.memberId)
      if (!member) {
        console.error(`Could not find member ${purchase.purchaser} with id: ${purchase.memberId}`)
      } else {
        const carts = Carts.find({ memberId: member._id, status: 'ready' })
        if (carts.length > 0) {
          debug(`${member.name} has a cart already`) // Should we just replace it though?
        } else {
          newCarts += Meteor.call('primeMemberRenewal', purchase._id, memberId)
        }
      }
    })
    debug(`Created ${newCarts} carts`)
  }
})

const signoutTicker = () => {
  const hour = moment().hour()
  // debug(`Tick ${hour}:00`)

  try {
    let n = 0
    crew = Members.find({ isHere: true })
    crew.forEach(dude => {
      const stillHereQuery = {
        memberId: dude._id
      }
      // debug('stillHereQuery', stillHereQuery)
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

Meteor.startup(() => {
  cron.schedule(SIGNOUT_TICKER_INTERVAL, Meteor.bindEnvironment(signoutTicker))
})
