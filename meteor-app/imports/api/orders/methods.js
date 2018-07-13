import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/orders'
import log from '/imports/lib/server/log'
const debug = require('debug')('att:server-methods')

Meteor.methods({
  'orders.insert'(order) {
    try {
      return Orders.insert(order)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.remove'(id) {
    try {
      log.info('removing order: ', id)
      return Orders.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.update'(id, orderedParts) {
    try {
      log.info('updating order: ', id, orderedParts)
      return Orders.update({ _id: id }, { $set: { ...orderedParts } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
})
