import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

const debug = require('debug')('b2b:startup')

Meteor.startup(() => {
  try {
    new SimpleSchema({
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
    }).validate(Meteor.settings.public)
  } catch (error) {
    throw new Meteor.Error(`Settings file, public section: [${error.message}]`)
  }
})
