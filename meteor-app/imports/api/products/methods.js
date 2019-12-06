import Products, { Carts } from './schema'
import Members from '/imports/api/members/schema'
import CONSTANTS from '/imports/api/constants'
import log from '/imports/lib/server/log'

const debug = require('debug')('b2b:cart')

Meteor.methods({
  'cart.remove': function(id) {
    try {
      log.info('removing cart id: ', id)
      return Carts.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },

  markAsPaid: function(memberId, cartId) {
    debug('Setting cart to paid...', cartId)
    try {
      const cart = Carts.findOne(cartId)
      if (!cart) throw new Meteor.Error('Could not find cart ' + cartId)
      const member = Members.findOne(memberId)
      if (!member) throw new Meteor.Error('Could not find member ' + memberId)
      Carts.update(cartId, {
        $set: {
          status: CONSTANTS.CART_STATUS.COMPLETE
        }
      })
      return { status: 'ok' }
    } catch (e) {
      return { error: e.message }
    }
  }
})
