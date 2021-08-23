import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

const debug = require('debug')('app:startup')

const publicSchema = new SimpleSchema({
  S3_PUBLIC_URL: String,
  // LIVECHAT: SimpleSchema.Integer,
})

const sentrySchema = new SimpleSchema({
  dsn: String,
  tracesSampleRate: Number,
})

const loggySchema = new SimpleSchema({
  token: String,
  subdomain: String,
})

const privateSchema = new SimpleSchema({
  S3_REGION: String,
  S3_ACCESS_KEY_ID: String,
  S3_SECRET_ACCESS_KEY: String,
  S3_PUBLIC_URL: String,
  UPLOAD_BUCKET: String,
  DOCUMENTS_BUCKET: String,
  MANDRILL_API_KEY: String,
  GOOGLE_SECRET: String,
  FACEBOOK_SECRET: String,
  sentry: { type: sentrySchema },
  loggly: { type: loggySchema },
})

Meteor.startup(() => {
  console.log('Checking for settings...')
  let errs = 0
  let vContext = publicSchema.newContext()
  vContext.validate(Meteor.settings.public || {})
  if (!vContext.isValid()) {
    errs += vContext.validationErrors.length
    if (!Meteor.isTest)
      console.error(
        'Errors found in public section of settings.json\n',
        vContext.validationErrors()
      )
  }
  vContext = privateSchema.newContext()
  if (Meteor.settings.env.environment !== 'prod') {
    privateSchema._schema.sentry.optional = true
    privateSchema._schema.loggly.optional = true
  }
  vContext.validate(Meteor.settings.private || {})
  if (!vContext.isValid()) {
    errs += vContext.validationErrors.length
    if (!Meteor.isTest)
      console.error(
        'Errors found in private section of settings.json\n',
        vContext.validationErrors()
      )
  }
  if (errs) throw new Meteor.Error(`Found ${errs} in settings file, aborting`)
})
