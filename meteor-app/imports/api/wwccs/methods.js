import { Meteor } from 'meteor/meteor'
import Wwccs from '/imports/api/parts/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:wwcc')

Meteor.methods({
  'wwccs.insert'(wwcc) {
    try {
      return Wwccs.insert(wwcc)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
})
