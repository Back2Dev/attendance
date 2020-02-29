import Purchases from './schema'
import Members from '/imports/api/members/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  'purchase.extend': (memberId, purchaseId, newExpiry) => {
    try {
      log.info(`Extending purchase id: ${purchaseId} to ${newExpiry}`)
      const purchase = Purchases.findOne(purchaseId)
      if (!purchase) throw new Meteor.Error(`Could not find purchase ${purchaseId}`)
      Members.update(memberId, { $set: { expiry: newExpiry, status: 'current' } })
      return Purchases.update(purchaseId, { $set: { expiry: newExpiry } })
    } catch (e) {
      log.error(e)
      throw new Meteor.Error(500, e.message)
    }
  }
})
