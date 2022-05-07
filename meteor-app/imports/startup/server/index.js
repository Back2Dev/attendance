import { Meteor } from 'meteor/meteor'

import './accounts'
import './members-data'
import './methods-payments'
import './members-import-pa'
import './parts-data'
import './product-data-all'
import './register-api.js'
import './cron-jobs'
import './cron-payment'
import './sms'
import './email'
import './startup'
import '/imports/lib/validator'
import '/imports/api/archive'
// import './assessment-data'
import setupStreams from './streams'
import { setupPaymentsApi } from '/imports/lib/server/route-payments'

Meteor.startup(() => {
  if (Meteor.isServer) {
    setupPaymentsApi()
    setupStreams() // Experimental for now
  }
})
