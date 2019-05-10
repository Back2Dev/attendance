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
  sendMembershipEmail(to, name, type, expiryDate, apiKey) {
    sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
    const options = {
      to,
      from: Meteor.settings.private.fromEmail,
      templateId: apiKey,
      dynamic_template_data: {
        name,
        type,
        expiryDate
      }
    }
    sgMail.send(options)
  },

  sendMembershipRenewals() {
    Members.find({}).forEach(member => {
      Purchases.find({
        memberId: member._id,
        $or: [{ code: 'PA-MEMB-12' }, { code: 'PA-MEMB-3' }],
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
      })
    })
  },
  sendMembershipReminderEmail() {
    Members.find({}).forEach(member => {
      Purchases.find({
        memberId: member._id,
        $or: [{ code: 'PA-MEMB-12' }, { code: 'PA-MEMB-3' }],
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
        debug('Email sending to ' + purchase.purchaser)
      })
    })
  }
})
