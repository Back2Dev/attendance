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
  async 'order.archive'(order) {
    try {
      log.info('moving order to archive ', order._id)
      await Orders.insert ({
        status: 1,
        additionalNotes: null,
        orderedParts: [],
        totalPrice: 0,
      })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.message)
    }
  },

  'orders.removePart'(order, part, totalPrice) {
    totalPrice = totalPrice - (part.price * part.qty)
    const id = order._id
    try {
      log.info('removing part from current order', part)
      return Orders.update({ _id: id }, { $pull: { orderedParts: { partId: part.partId } }, $set: { totalPrice } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.addPart'(id, orderedPart, totalPrice) {
    try {
      log.info('updating order: ', orderedPart)
      return Orders.update({ _id: id }, { $push: { orderedParts: { ...orderedPart } }, $set: { totalPrice } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'order.updateQty'(id, orderedParts, totalPrice) {
    try {
      log.info('updating quantity to order ')
      return Orders.update({ _id: id }, { $set: { 
        orderedParts,
        totalPrice,
      } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
})
