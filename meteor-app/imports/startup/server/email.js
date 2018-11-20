import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
const debug = require('debug')('att:email')
import { eventLog } from '/imports/api/events'
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
  'sendEmail'(
    destination = DEFAULT_DESTINATION,
    message = DEFAULT_MESSAGE,
    subject = DEFAULT_SUBJECT
  ) {
    debug(`Sending email: ${subject}: ${message} to ${destination}`)

    const options = {
      from: 'mikkel@back2bikes.com.au',
      to: destination,
      subject: subject,
      text: message
    }
    try {
      Email.send(options)
    } catch (error) {
      log.error("Error from email gateway", error)
    }

  },
})

