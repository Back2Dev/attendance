import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:orders')


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
  'orders.removePart'(id, part) {
    try {
      log.info('removing part from current order', part)
      return Orders.update({ _id: id }, { $pull: { orderedParts: part } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.addPart'(id, orderedPart) {
    try {
      log.info('updating order: ', orderedPart)
      return Orders.update({ _id: id }, { $push: { orderedParts: { ...orderedPart } } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'order.updateQty'(id, orderedParts) {
    try {
      log.info('updating quantity to order ')
      return Orders.update({ _id: id }, { $set: { orderedParts } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },


})
