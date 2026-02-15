import { Meteor } from 'meteor/meteor'
const cron = require('node-cron')
const debug = require('debug')('app:server')

// Ensure collection2 extends Mongo collections before schemas load
import 'meteor/aldeed:collection2'
import 'meteor/aldeed:collection2/main'
//
// Importing the data api's makes sure collections are set up properly.
//
import '/imports/lib/validator'
import './pubs'
import './methods'
import './slingshot'
import './cron-jobs'
import './settings'
import logger from '/imports/lib/log'
// TODO: Work out if this is needed, I suspect not
import './accounts'
import './migrations'
import './click-through'
import './startup-checks'
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

// Meteor.beforeAllMethods/afterAllMethods were provided by method-hooks; after removing that package in Meteor 3 we no longer wire the hooks.
