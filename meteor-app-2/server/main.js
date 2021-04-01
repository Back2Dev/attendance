import { Meteor } from 'meteor/meteor'
import { Picker } from 'meteor/meteorhacks:picker'
var bodyParser = require('body-parser')
const cron = require('node-cron')
const debug = require('debug')('b2b:server')

//
// Importing the data api's makes sure collections are set up properly.
//
import '/imports/lib/validator'
import './fixtures'
import './pubs'
import './methods'
import './search'
import './slingshot'
import './cron-jobs'
import './settings'
import logger from '/imports/lib/log'
// TODO: Work out if this is needed, I suspect not
import './accounts'
import './migrations'
Meteor.startup(() => {
  if (Meteor.isServer) {
  }
})

Meteor.startup(() => {
  // code to run on server ONLY at startup

  // Set up a couple of indexes to help performance
  // - indexes are usually created in the schema file

  // Stop users from updating their own profile
  Meteor.users.deny({
    update: function () {
      return true
    },
  })
})

Meteor.startup(() => {
  // runs up ncc api
  Picker.middleware(bodyParser.json())
  Picker.route('/restapi/voi', function (params, req, res, next) {
    logger.audit('receiving ncc data', req.body) // logs the webhook request
    Meteor.call('update.voi', req.body)
    res.end()
  })
})

// We won't log certain methods, for fear of exposing their contents and causing a security meltdown
const dontLog = ['login']
Meteor.beforeAllMethods(function (...args) {
  // The first element in the args array is the method name
  // const [methodName, ...rest] = args
  // if (dontLog.includes(methodName))
  //   logger.info(
  //     `Calling Meteor method [${methodName}]`,
  //     ' --- === Params obscured === --- '
  //   )
  // else logger.info(`Calling Meteor method [${methodName}]`, rest)
  //
  // Do some useful things, like
  //   1) Check permissions
  //   2) Log the call
  //

  // if (Meteor.user() !== null) {
  //   if (!Meteor.user().roles.some((role) => role._id === 'ADM'))
  //     throw new Meteor.Error(403, 'Forbidden')
  // }
  return true
})

Meteor.afterAllMethods(function (params) {
  // Work out how to log
})
