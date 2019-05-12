import { Meteor } from 'meteor/meteor'

import './members-data'
import './methods-payments'
import './members-import-pa'
import './parts-data'
import './product-data-all'
import './register-api.js'
import './cron-jobs'
import './sms'
import './email'
import '/imports/lib/validator'
import '/imports/api/archive'
import './assessment-data'
import { setupPaymentsApi } from '/imports/lib/server/route-payments'

Meteor.startup(() => {
  if (Meteor.isServer) {
    setupPaymentsApi()
  }
})
