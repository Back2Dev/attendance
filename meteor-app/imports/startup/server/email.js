import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
const debug = require('debug')('b2b:email')
const sgMail = require('@sendgrid/mail')
import { eventLog } from '/imports/api/eventlogs'
import Purchases from '/imports/api/purchases/schema'
import Members from '/imports/api/members/schema'

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
            status: status
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
          Members.update(
            { _id: purchase.memberId },
            {
              $set: {
                status: 'expired'
              }
            }
          )
        })
        Purchases.find({ memberId: member._id, expiry: { $gt: new Date() } }).forEach(purchase => {
          Members.update(
            { _id: purchase.memberId },
            {
              $set: {
                status: 'current'
              }
            }
          )
        })
      })
    } catch (e) {
      debug(e)
    }
  },
  updateSubsTypeAll() {
    try {
      Purchases.find({ code: /PA-PASS/ }).forEach(purchase => {
        Members.update(
          { _id: purchase.memberId },
          {
            $set: {
              subsType: 'pass'
            }
          }
        )
      })
      Purchases.find({ code: /PA-MEMB/ }).forEach(purchase => {
        Members.update(
          { _id: purchase.memberId },
          {
            $set: {
              subsType: 'member'
            }
          }
        )
      })
      Purchases.find({ code: 'PA-PASS-CASUAL' }).forEach(purchase => {
        Members.update(
          { _id: purchase.memberId },
          {
            $set: {
              subsType: 'casual'
            }
          }
        )
      })
      Members.find({ subsType: null }).forEach(member => {
        Members.update(
          { _id: member._id },
          {
            $set: {
              subsType: 'casual'
            }
          }
        )
      })
    } catch (e) {
      debug(e)
    }
  },
  updateRemainingAll() {
    Members.find({ subsType: 'pass', status: 'current' }).forEach(member => {
      remValue = 10 - member.sessionCount
      Members.update({ _id: member._id }, { $set: { remaining: remValue } })
    })
    Members.find({ subsType: 'pass', status: 'expired' }).forEach(member => {
      if (member.sessionCount == 0) {
        remValue = 0
      } else {
        remValue = 10 - member.sessionCount
      }

      Members.update({ _id: member._id }, { $set: { remaining: remValue } })
    })
    Members.find({ $or: [{ subsType: 'member' }, { subsType: 'casual' }] }).forEach(member => {
      Members.update({ _id: member._id }, { $set: { remaining: 0 } })
    })
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
  }
})
