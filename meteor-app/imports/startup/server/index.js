import { Meteor } from 'meteor/meteor';

import './members-data'
import './parts-data'
import './products-data'
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
