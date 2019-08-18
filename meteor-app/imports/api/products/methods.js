import Products, { Carts } from './schema'
import log from '/imports/lib/server/log'

Meteor.methods({
  'cart.remove': function(id) {
    try {
      log.info('removing cart id: ', id)
      return Carts.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
})
