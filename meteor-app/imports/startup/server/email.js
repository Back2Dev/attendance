import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
const debug = require('debug')('b2b:email')
const sgMail = require('@sendgrid/mail')
import { eventLog } from '/imports/api/eventlogs'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Members, { pinAddressFieldMap } from '/imports/api/members/schema'

import log from '/imports/lib/log'
import Moment from 'moment'

const DEFAULT_MESSAGE = 'Hello from back2bikes. Heres your pin'
const DEFAULT_DESTINATION = 'mrslwiseman@gmail.com'
const DEFAULT_SUBJECT = 'Back 2 Bikes PIN reminder.'

const emailSettings = { enabled: false }

Meteor.startup(() => {
  if (Meteor.settings.env && Meteor.settings.env.MAIL_URL) {
    emailSettings.enabled = Meteor.settings.env.MAIL_URL != undefined
    debug(`Email sending is ${emailSettings.enabled}`)
  }
})

Meteor.methods({
  sendPINEmail(destination = DEFAULT_DESTINATION, message = DEFAULT_MESSAGE, subject = DEFAULT_SUBJECT) {
    debug(`Sending email: ${subject}: ${message} to ${destination}`)

    const options = {
      from: 'admin@back2bikes.com.au',
      to: destination,
      subject: subject,
      text: message
    }
    try {
      Email.send(options)
    } catch (error) {
      log.error('Error from email gateway', error)
    }
  },
  sendMembershipEmail(to, name, type, expiry, apiKey) {
    sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
    const options = {
      to,
      from: Meteor.settings.private.fromEmail,
      templateId: apiKey,
      dynamic_template_data: {
        name,
        type,
        expiry
      }
    }
    sgMail.send(options)
  },

  sendMembershipRenewals() {
    Members.find({}).forEach(member => {
      Purchases.find({
        memberId: member._id,
        code: '/PA-MEMB/',
        expiry: { $lt: new Date() }
      }).forEach(purchase => {
        Meteor.call(
          'sendMembershipEmail',
          member.email,
          member.name,
          purchase.productName,
          Moment(purchase.expiry).format('Do MMM YYYY'),
          Meteor.settings.private.expiredMembershipID
        )
        debug('Sending Membership Renewal to ' + member.email)
      })
    })
  },
  sendMembershipReminderEmail() {
    Members.find({}).forEach(member => {
      Purchases.find({
        memberId: member._id,
        code: /PA-MEMB/,
        expiry: { $gt: new Date() }
      }).forEach(purchase => {
        Meteor.call(
          'sendMembershipEmail',
          member.email,
          member.name,
          purchase.productName,
          Moment(purchase.expiry).format('Do MMM YYYY'),
          Meteor.settings.private.validMembershipID
        )
        debug('Sending Membership reminder to ' + member.email)
      })
    })
  },
  sendPassEmail(to, name, visitsUsed, apiKey) {
    sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
    const options = {
      to,
      from: Meteor.settings.private.fromEmail,
      templateId: apiKey,
      dynamic_template_data: {
        name,
        type,
        expiry,
        visitsUsed
      }
    }
    sgMail.send(options)
  },
  sendPassRenewal() {
    Members.find({ $where: 'this.sessions.length >=5' }).forEach(member => {
      Purchases.find({
        memberId: member._id,
        code: /PA-PASS/,
        expiry: { $lt: new Date() }
      }).forEach(p => {
        debug(p.purchaser + ' has expired PASS... Sending Renewal Email.')
      })
      Purchases.find({
        memberId: member._id,
        code: /PA-PASS/,
        expiry: { $gt: new Date() }
      }).forEach(p => {
        debug(p.purchaser + ' has valid PASS.... Sending Reminder Email')
      })
    })
  },
  updateStatus(memberId, status) {
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
  updateStatusAll() {
    try {
      Members.find({}).forEach(member => {
        Purchases.find({ memberId: member._id, expiry: { $lt: new Date() } }).forEach(purchase => {
          debug(`Member ${member.name} is expired (${purchase.expiry})`)
          Members.update(
            { _id: purchase.memberId },
            {
              $set: {
                status: 'expired',
                expiry: purchase.expiry
              }
            }
          )
        })
        Purchases.find({ memberId: member._id, expiry: { $gt: new Date() } }).forEach(purchase => {
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
  updateSubsTypeAll() {
    try {
      Purchases.find({ code: /PA-PASS/ }).forEach(purchase => {
        debug(`Member ${purchase.memberId} ${purchase.purchaser} pass: ${purchase.code}`)
        Members.update(purchase.memberId, {
          $set: {
            subsType: 'pass'
          }
        })
      })
      Purchases.find({ code: /PA-MEMB/ }).forEach(purchase => {
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
        debug(`!!! Member ${member.name} unknown: setting to casual`)
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
  updateRemainingAll() {
    Members.find({ subsType: 'pass', status: 'current' }).forEach(member => {
      Purchases.find({ memberId: member._id }).forEach(purchase => {
        remValue = (purchase.remaining || 0) - member.sessionCount
      })
      debug(`Current member update ${member.name} remaining: ${remValue}`)
      Members.update(member._id, { $set: { remaining: remValue } })
    })
    Members.find({ subsType: 'pass', status: 'expired' }).forEach(member => {
      Purchases.find({ memberId: member._id }).forEach(purchase => {
        if (member.sessionCount == 0) {
          remValue = 0
        } else {
          remValue = (purchase.remaining || 0) - member.sessionCount
        }
      })
      debug(`Expired member update ${member.name} remaining: ${remValue}`)
      Members.update({ _id: member._id }, { $set: { remaining: remValue } })
    })
    Members.find({ $or: [{ subsType: 'member' }, { subsType: 'casual' }] }).forEach(member => {
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
  getMembersByStatus(status) {
    Members.find({ status: status }).forEach(member => {
      debug(member.name)
    })
  },
  getMembersBySubsType(subsType) {
    Members.find({ subsType: subsType }).forEach(member => {
      debug(member.name)
    })
  },

  // Create shopping cart entries for previous offenders
  primeRenewals() {
    Purchases.find({}).forEach(purchase => {
      const member = Members.findOne(purchase.memberId)
      if (!member) {
        console.error(`Could not find member ${purchase.purchaser} with id: ${purchase.memberId}`)
      } else {
        const carts = Carts.find({ memberId: member._id, status: 'ready' })
        if (carts.length > 0) {
          debug(`${member.name} has a cart already`)
        } else {
          const product = Products.findOne(purchase.productId)
          if (!product) {
            console.error(
              `Could not find product to match previous purchase ${purchase.productName} ${purchase.productId}`
            )
          } else {
            product.qty = 1
            const creditCard = {}
            Object.keys(pinAddressFieldMap).forEach(key => {
              creditCard[key] = member[pinAddressFieldMap[key]]
            })
            const cart = {
              memberId: member._id,
              email: member.email,
              customerName: member.name,
              products: [product],
              price: product.price,
              totalqty: 1,
              prodqty: { [purchase.productId]: 1 },
              creditCard,
              status: 'ready'
            }
            const cartId = Carts.insert(cart)
          }
        }
      }
    })
  }
})
