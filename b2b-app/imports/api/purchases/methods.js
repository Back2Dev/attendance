import Purchases from './schema'
import Profiles from '/imports/api/profiles/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('app:server-methods')

Meteor.methods({
  'purchase.extend': async (profileId, purchaseId, newExpiry) => {
    try {
      log.info(`Extending purchase id: ${purchaseId} to ${newExpiry}`)
      const purchase = await Purchases.findOneAsync(purchaseId)
      if (!purchase) throw new Meteor.Error(`Could not find purchase ${purchaseId}`)
      await Profiles.updateAsync(profileId, {
        $set: { expiry: newExpiry, status: 'current' },
      })
      return await Purchases.updateAsync(purchaseId, { $set: { expiry: newExpiry } })
    } catch (e) {
      log.error(e)
      throw new Meteor.Error(500, e.message)
    }
  },
})
