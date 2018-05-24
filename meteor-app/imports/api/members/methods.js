import { Meteor } from 'meteor/meteor'
import Members from '/imports/api/members/members'
import log from '/imports/lib/server/log'
const debug = require('debug')('att:server-methods')

Meteor.methods({
  'members.insert'(member) {
    try {
      return Members.insert(member)
    } catch (e) {
      log.error({ e })
      // give the client the error
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
})