import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'

import log from '/imports/lib/log'
const debug = require('debug')('b2b:email')
const sgMail = require('@sendgrid/mail')

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
  // Send forgotten PIN by email
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

  // Send membership expiry email
  sendMembershipEmail(to, name, type, expiry, link, templateId) {
    try {
      sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
      const options = {
        to,
        from: Meteor.settings.private.fromEmail,
        templateId,
        dynamic_template_data: {
          name,
          type,
          expiry,
          link: `${Meteor.absoluteUrl()}${link}`
        }
      }
      log.info(`Sending email ${templateId} to ${name} <${to}> link: ${link}`)
      sgMail.send(options)
    } catch (e) {
      log.error(`Error sending email: ${e.message}`)
    }
  },

  // Send 'Your pass has expired/is empty' email
  sendPassEmail(to, name, visitsUsed, apiKey) {
    try {
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
    } catch (e) {
      log.error(`Error sending pass email: ${e.message}`)
    }
  }
})
