import Products, { Carts } from './schema'
import Members from '/imports/api/members/schema'
import CONSTANTS from '/imports/api/constants'
import log from '/imports/lib/server/log'

const debug = require('debug')('b2b:cart')

Meteor.methods({
  'rm.Products': async (id) => {
    await Products.removeAsync(id)
  },

  'update.Products': async (form) => {
    const id = form._id
    delete form._id
    await Products.updateAsync(id, { $set: form })
  },

  'insert.Products': async (form) => {
    console.log('Inserting product', form)
    const id = await Products.insertAsync(form)
    console.log('Added ', id)
  },

  'cart.remove': async function (id) {
    try {
      log.info('removing cart id: ', id)
      return await Carts.removeAsync({ _id: id })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },

  markAsPaid: async function (cartId, paymentMethod) {
    debug('Setting cart to paid...', cartId)
    try {
      const cart = await Carts.findOneAsync(cartId)
      if (!cart) throw new Meteor.Error('Could not find cart ' + cartId)
      await Carts.updateAsync(cartId, {
        $set: {
          status: CONSTANTS.CART_STATUS.COMPLETE,
          paymentMethod
        }
      })
      await Meteor.callAsync('acceptPayment', cartId, paymentMethod)
      return { status: 'ok' }
    } catch (e) {
      return { error: e.message }
    }
  }
})
