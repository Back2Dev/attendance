import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

const debug = require('debug')('b2b:startup')

const publicSchema = new SimpleSchema({
  logo: String,
  member: String,
  parts: SimpleSchema.Integer,
  servicing: SimpleSchema.Integer,
  recruit: String,
  register: String,
  admin: SimpleSchema.Integer,
  shop: SimpleSchema.Integer,
  org: String,
  orgid: String,
  paymentApiKey: String,
  paymentTest: Boolean,
  paymentSite: String,
  tagline: String
})

const privateSchema = new SimpleSchema({
  paymentURL: String,
  customerURL: String,
  paymentApiKey: String,
  sendgridApikey: String,
  fromEmail: String,
  expiredMembershipID: String,
  validMembershipID: String,
  expiredPassID: String,
  validPassID: String,
  registerCardID: String
})

Meteor.startup(() => {
  let errs = 0
  let vContext = publicSchema.newContext()
  vContext.validate(Meteor.settings.public)
  if (!vContext.isValid()) {
    errs += vContext.validationErrors.length
    console.error('Errors found in public section of settings.json\n', vContext.validationErrors())
  }
  vContext = privateSchema.newContext()
  vContext.validate(Meteor.settings.private)
  if (!vContext.isValid()) {
    errs += vContext.validationErrors.length
    console.error('Errors found in private section of settings.json\n', vContext.validationErrors())
  }
  if (errs) throw new Meteor.Error(`Found ${errs} in settings file, aborting`)
})
