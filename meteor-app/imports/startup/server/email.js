import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
import SimpleSchema from 'simpl-schema'

import log from '/imports/lib/log'
const debug = require('debug')('b2b:email')
const sendGrid = require('@sendgrid/mail')

const DEFAULT_MESSAGE = 'Hello from back2bikes. Heres your pin'
const DEFAULT_DESTINATION = 'mrslwiseman@gmail.com'
const DEFAULT_SUBJECT = 'Back 2 Bikes PIN reminder.'

const emailSettings = { enabled: false }
let sgKey

// A Wrapper for sendgrid - provide a centralised location, so we can decide whether to actually send or not
const sgMail = {
  setApiKey: apiKey => {
    sgKey = apiKey
    return sendGrid.setApiKey(apiKey)
  },
  send: options => {
    if (Meteor.isTest) {
      debug('Test mode, not sending email')
      return null
    }
    if (!sgKey) {
      debug('Sendgrid API key not set')
      return null
    }
    return sendGrid.send(options)
  }
}

Meteor.startup(() => {
  if (Meteor.settings.env && Meteor.settings.env.MAIL_URL) {
    emailSettings.enabled = Meteor.settings.env.MAIL_URL != undefined
    debug(`Email sending is ${emailSettings.enabled}`)
  }
})

// Email schemas:
const genericActionEmailSchema = new SimpleSchema({
  subject: String, // Subject of the email
  headline: String, // Headline is the call to action
  link: String, // The link to go to
  action: String,
  message: String, // An explanation text of what the email is about
  name: String // Person's name for personalisation
})

const genericInfoEmailSchema = new SimpleSchema({
  subject: String, // Subject of the email
  headline: String, // Headline is the call to action
  message: String, // An explanation text of what the email is about
  name: String // Person's name for personalisation
})

Meteor.methods({
  // Send forgotten PIN by email
  sendPINEmail(to = DEFAULT_DESTINATION, pin, message = DEFAULT_MESSAGE, subject = DEFAULT_SUBJECT) {
    debug(`Sending email: ${subject} to ${to}`)
    if (Meteor.settings.private.sendgridApikey && Meteor.settings.private.forgotPINID) {
      try {
        sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
        const options = {
          to,
          from: Meteor.settings.private.fromEmail,
          templateId: Meteor.settings.private.forgotPINID,
          dynamic_template_data: {
            // name,
            pin
          }
        }
        log.info(`Sending email to <${to}>`)
        sgMail.send(options)
      } catch (e) {
        log.error(`Error sending forgotten PIN email: ${e.message}`)
      }
    } else {
      const options = {
        from: Meteor.settings.private.fromEmail,
        to,
        subject,
        text: message
      }
      try {
        Email.send(options)
      } catch (error) {
        log.error('Error from email gateway', error)
      }
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
      log.error(`Error sending membership expiry email: ${e.message}`)
    }
  },

  // Send 'Your pass has expired/is empty' or Casual signup email
  sendPassEmail(to, name, expiry, link, templateId) {
    try {
      sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
      const options = {
        to,
        from: Meteor.settings.private.fromEmail,
        templateId,
        dynamic_template_data: {
          name,
          expiry,
          link: `${Meteor.absoluteUrl()}${link}`
        }
      }
      sgMail.send(options)
    } catch (e) {
      log.error(`Error sending pass email: ${e.message}`)
    }
  },

  sendInvoiceEmail(to, mergeData, templateId) {
    try {
      debug(`Sending invoice email to ${to}`, mergeData)
      sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
      const options = {
        to,
        bcc: Meteor.settings.private.bcc,
        from: Meteor.settings.private.fromEmail,
        templateId,
        dynamic_template_data: mergeData
      }
      sgMail.send(options)
    } catch (e) {
      log.error(`Error sending invoice email: ${e.message}`)
    }
  },

  sendGenericActionEmail(to, mergeData, templateId) {
    try {
      genericActionEmailSchema.validate(mergeData) // Check that we have everything we need
      debug(`Sending generic action email to ${to}`, mergeData)
      sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
      const options = {
        to,
        from: Meteor.settings.private.fromEmail,
        templateId,
        dynamic_template_data: mergeData
      }
      sgMail.send(options)
    } catch (e) {
      log.error(`Error sending generic action email: ${e.message}`)
    }
  },

  sendGenericInfoEmail(to, mergeData, templateId) {
    try {
      debug(`Sending generic info email to ${to}`, mergeData)
      genericInfoEmailSchema.validate(mergeData) // Check that we have everything we need
      sgMail.setApiKey(Meteor.settings.private.sendgridApikey)
      const options = {
        to,
        from: Meteor.settings.private.fromEmail,
        templateId,
        dynamic_template_data: mergeData
      }
      log.info(options)
      sgMail.send(options)
    } catch (e) {
      log.error(`Error sending generic info email: ${e.message}`)
    }
  }
})
