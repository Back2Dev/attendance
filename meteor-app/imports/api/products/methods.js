import Products, { Carts } from './schema'
import Members from '/imports/api/members/schema'
import CONSTANTS from '/imports/api/constants'
import log from '/imports/lib/server/log'

const debug = require('debug')('b2b:cart')

Meteor.methods({
  'rm.Products': id => {
    Products.remove(id)
  },

  'update.Products': form => {
    const id = form._id
    delete form._id
    Products.update(id, { $set: form })
  },

  'insert.Products': form => {
    console.log('Inserting product', form)
    const id = Products.insert(form)
    console.log('Added ', id)
  },

  'cart.remove': function(id) {
    try {
      log.info('removing cart id: ', id)
      return Carts.remove({ _id: id })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },

  markAsPaid: function(cartId, paymentMethod) {
    debug('Setting cart to paid...', cartId)
    try {
      const cart = Carts.findOne(cartId)
      if (!cart) throw new Meteor.Error('Could not find cart ' + cartId)
      Carts.update(cartId, {
        $set: {
          status: CONSTANTS.CART_STATUS.COMPLETE,
          paymentMethod
        }
      })
      Meteor.call('acceptPayment', cartId, paymentMethod)
      return { status: 'ok' }
    } catch (e) {
      return { error: e.message }
    }
  }
})
