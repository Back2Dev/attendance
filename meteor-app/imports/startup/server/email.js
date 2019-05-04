import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
const debug = require('debug')('b2b:email')
import { eventLog } from '/imports/api/eventlogs'
import Purchases from '/imports/api/purchases/schema'
import Members from '/imports/api/members/schema'

import log from '/imports/lib/log'

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
  sendMembershipRenewals() {
    debug('sendMembershipRenewals')
    Purchases.find({ code: 'PA-MEMB-12', expiry: { $lt: new Date() } }).forEach(purchase => {
      debug(purchase.purchaser, purchase.expiry)
      const member = Members.findOne(purchase.memberId)
      debug(member)
    })
  }
})
