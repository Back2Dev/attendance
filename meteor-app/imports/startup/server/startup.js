import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

const debug = require('debug')('b2b:startup')

const publicSchema = new SimpleSchema({
  logo: String,
  background: String,
  member: String,
  parts: SimpleSchema.Integer,
  servicing: SimpleSchema.Integer,
  recruit: String,
  register: String,
  admin: SimpleSchema.Integer,
  shop: SimpleSchema.Integer,
  payNow: SimpleSchema.Integer,
  addCard: SimpleSchema.Integer,
  org: String,
  orgid: String,
  paymentApiKey: String,
  paymentTest: Boolean,
  paymentSite: String,
  tagline: String,
  support: String,
  welcome: String
})

const privateSchema = new SimpleSchema({
  paymentURL: String,
  customerURL: String,
  paymentApiKey: String,
  sendgridApikey: String,
  fromEmail: String,
  // All these email id's should really go into the DB
  expiredMembershipID: String,
  validMembershipID: String,
  expiredPassID: String,
  validPassID: String,
  registerCardID: String,
  forgotPINID: String,
  invoiceID: String,
  genericActionID: String,
  genericInfoID: String,
  bcc: String
})

Meteor.startup(() => {
  let errs = 0
  let vContext = publicSchema.newContext()
  vContext.validate(Meteor.settings.public || {})
  if (!vContext.isValid()) {
    errs += vContext.validationErrors.length
    if (!Meteor.isTest) console.error('Errors found in public section of settings.json\n', vContext.validationErrors())
  }
  vContext = privateSchema.newContext()
  vContext.validate(Meteor.settings.private || {})
  if (!vContext.isValid()) {
    errs += vContext.validationErrors.length
    if (!Meteor.isTest) console.error('Errors found in private section of settings.json\n', vContext.validationErrors())
  }
  if (errs) throw new Meteor.Error(`Found ${errs} in settings file, aborting`)
})
