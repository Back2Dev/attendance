import { Meteor } from 'meteor/meteor'
import Parts from '/imports/api/parts/schema'
import log from '/imports/lib/server/log'

const debug = require('debug')('b2b:parts')
Meteor.methods({
  'parts.insert'(part) {
    try {
      return Parts.insert(part)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
})
