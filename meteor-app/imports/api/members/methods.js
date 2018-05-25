import { Meteor } from 'meteor/meteor'
import Members from '/imports/api/members/members'
import log from '/imports/lib/server/log'
const debug = require('debug')('att:server-methods')

Meteor.methods({
  'members.insert'(member) {
    try {
      Members.insert(member)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
})