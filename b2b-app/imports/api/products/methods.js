import Products, { ProductTypes, Carts } from './schema'
import Profiles from '/imports/api/profiles/schema'
import CONSTANTS from '/imports/api/constants'
import log from '/imports/lib/server/log'

const debug = require('debug')('app:cart')

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

  'upsert.slug.products': async (form, options) => {
    try {
      const rec = await Products.findOneAsync({ slug: form.slug })
      let result
      if (rec) {
        const _id = rec._id
        delete rec._id
        const unset = {}
        // Compare the old version of the record,
        Object.keys(rec)
          .filter((key) => !key.match(/_id|At|By$/))
          .forEach((key) => {
            if (!form.hasOwnProperty(key)) unset[key] = 1 // Remove keys not in the new record
          })
        await Products.updateAsync({ _id }, { $set: form, $unset: unset })
        result = { status: 'success', message: `Updated product ${form.slug}` }
      } else {
        const id = await Products.insertAsync(form)
        result = { status: 'success', message: `Added product ${form.slug}` }
      }
      debug({ message: result.message })
      return result
    } catch (e) {
      console.error(e)
      return {
        status: 'failed',
        message: `Error adding product: ${e.message}`,
      }
    }
  },
  'upsert.slug.product-types': async (form, options) => {
    try {
      const rec = await ProductTypes.findOneAsync({ slug: form.slug })
      let result
      if (rec) {
        const _id = rec._id
        delete rec._id
        const unset = {}
        // Compare the old version of the record,
        Object.keys(rec)
          .filter((key) => !key.match(/_id|At|By$/))
          .forEach((key) => {
            if (!form.hasOwnProperty(key)) unset[key] = 1 // Remove keys not in the new record
          })
        await ProductTypes.updateAsync({ _id }, { $set: form, $unset: unset })
        result = { status: 'success', message: `Updated producttype ${form.slug}` }
      } else {
        const id = await ProductTypes.insertAsync(form)
        result = { status: 'success', message: `Added producttype ${form.slug}` }
      }
      debug({ message: result.message })
      return result
    } catch (e) {
      console.error(e)
      return {
        status: 'failed',
        message: `Error adding producttype: ${e.message}`,
      }
    }
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
          paymentMethod,
        },
      })
      await Meteor.callAsync('acceptPayment', cartId, paymentMethod)
      return { status: 'ok' }
    } catch (e) {
      return { error: e.message }
    }
  },
})
