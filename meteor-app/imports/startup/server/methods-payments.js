import { Meteor } from 'meteor/meteor' // base
import axios from 'axios'
import { Carts } from '/imports/api/products/schema'
import CONSTANTS from '/imports/api/constants'
import Members from '/imports/api/members/schema'

const debug = require('debug')('b2b:payments')

Meteor.methods({
  makePayment: async function(chargeData) {
    const paymentURL = Meteor.settings.private.paymentURL
    chargeData.ip_address = this.connection.clientAddress

    const request = {
      url: paymentURL,
      method: 'post',
      data: chargeData,
      responseType: 'json',
      validateStatus: function(status) {
        return status >= 200
      },

      transformResponse: [
        function(data) {
          // Do whatever you want to transform the data
          // debug('intercepted data', data)
          return data
        }
      ],
      auth: {
        username: Meteor.settings.private.paymentApiKey,
        password: ''
      }
    }
    debug(`Sending charge to ${paymentURL}`, request)
    try {
      const response = await axios(request)
      debug(response.data.substr(0, 250))
      const data = JSON.parse(response.data)
      if (data.error) {
        const errText = `Payment error: ${data.error_description}`
        console.error(errText)
        return errText
      }
      data.response.status = response.status
      data.response.statusText = response.statusText
      data.response.customerToken = data.response.token
      delete data.response.token
      debug(`status: ${response.status} ${response.statusText}`, data.response)
      Carts.update(chargeData.metadata.cartId, {
        $set: {
          status: CONSTANTS.CART_STATUS.COMPLETE,
          chargeResponse: data.response
        }
      })

      debug(data.response)
      return data.response
    } catch (error) {
      debug(error)
      // throw new Meteor.Error(error.message)
      return `Payment error: ${error.message}`
    }
  },

  createCustomer: async function(custData) {
    const customerURL = Meteor.settings.private.customerURL
    const customer = {
      email: custData.email,
      card_token: custData.card_token,
      ip_address: this.connection.clientAddress
    }
    const request = {
      url: customerURL,
      method: 'post',
      data: customer,
      validateStatus: function(status) {
        return status >= 200
      },

      transformResponse: [
        function(data) {
          // Do whatever you want to transform the data
          // debug('intercepted data', data)
          return data
        }
      ],
      auth: {
        username: Meteor.settings.private.paymentApiKey,
        password: ''
      }
    }
    debug(`Creating customer at ${customerURL}`, request)
    try {
      const response = await axios(request)
      const data = JSON.parse(response.data)
      data.response.status = response.status
      data.response.statusText = response.statusText
      data.response.customerToken = data.response.token
      delete data.response.token
      debug(`status: ${response.status} ${response.statusText}`, data.response)
      // Carts.update(custData.metadata.cartId, {
      //   $set: {
      //     customerResponse: data.response
      //   }
      // })
      const cart = Carts.findOne(custData.metadata.cartId)
      if (cart && cart.memberId) Members.update(cart.memberId, { $set: { paymentCustId: data.response.customerToken } })
      else Members.update({ email: custData.email }, { $set: { paymentCustId: data.response.customerToken } })
      return data
    } catch (error) {
      debug(error)
      // throw new Meteor.Error(error.message)
      return error.message
    }
  }
})
