import { Meteor } from 'meteor/meteor' // base
import axios from 'axios'
import { Carts } from '/imports/api/products/schema'
import CONSTANTS from '/imports/api/constants'
import Members from '/imports/api/members/schema'
import Charges from '/imports/api/charges/schema'

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
          chargeResponse: data.response,
          creditCard: data.response.card
        }
      })

      debug(data.response)
      return data.response
    } catch (error) {
      debug(error)
      // throw new Meteor.Error(error.message)
      return `Payment exception: ${error.message}`
    }
  },

  mockMakePayment: async function(chargeData, creditCardInfo) {
    try {
      const response = {
        success: true,
        amount: 2000,
        currency: 'AUD',
        description: 'Purchase',
        email: 'test@test.com',
        ip_address: '127.0.0.1',
        created_at: '2019-12-13T03:36:20Z',
        status_message: 'Success',
        error_message: null,
        card: {
          scheme: 'visa',
          display_number: 'XXXX-XXXX-XXXX-' + creditCardInfo.mockNumber.slice(-4),
          issuing_country: 'AU',
          name: creditCardInfo.mockName,
          address_line1: '1',
          address_line2: null,
          address_city: '1',
          address_postcode: '1',
          address_state: '1',
          address_country: 'Australia'
        },
        transfer: [],
        amount_refunded: 0,
        total_fees: 65,
        merchant_entitlement: 1935,
        refund_pending: false,
        authorisation_expired: false,
        captured: true,
        captured_at: '2019-12-13T03:36:20Z',
        settlement_currency: 'AUD',
        active_chargebacks: false,
        metadata: {
          cartid: 'AKoeSGMPX3aYqprxc',
          codes: 'PA-CASUAL'
        },
        status: 201,
        statusText: 'Created',
        customerToken: 'ch_ozlmTbMTrfaqiVEdtdgZ3w'
      }
      Carts.update(chargeData.metadata.cartId, {
        $set: {
          status: CONSTANTS.CART_STATUS.COMPLETE,
          chargeResponse: response,
          creditCard: response.card
        }
      })

      return response
    } catch (error) {
      debug(error)
      // throw new Meteor.Error(error.message)
      return `mockMakePayment error: ${error.message}`
    }
  },

  createMockCustomer: function(custData, token) {
    const cart = Carts.findOne(custData.metadata.cartId)
    if (cart && cart.memberId) Members.update(cart.memberId, { $set: { paymentCustId: token } })
    else Members.update({ email: custData.email }, { $set: { paymentCustId: token } })
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
  },
  'refresh.charges': async function() {
    let page = '1'
    let n = 0
    do {
      const chargeURL = `${Meteor.settings.private.paymentURL}?page=${page}`
      const request = {
        url: chargeURL,
        method: 'get',
        validateStatus: function(status) {
          return status >= 200
        },
        auth: {
          username: Meteor.settings.private.paymentApiKey,
          password: ''
        }
      }
      debug(`Fetching charges from ${chargeURL}`, request)
      try {
        const r = await axios(request)
        const { data } = r
        debug(`status: ${r.status} ${r.statusText}`, data.pagination)
        data.response.forEach(charge => {
          const c = Charges.findOne({ token: charge.token })
          if (!c) {
            charge.reconciled = false
            charge.matched = false
            const id = Charges.insert(charge)
            if (id) n = n + 1
          }
        })
        page = data.pagination.next
      } catch (error) {
        debug(error)
        // throw new Meteor.Error(error.message)
        return { status: 'failed', message: error.message }
      }
    } while (page)
    return { status: 'success', message: `Added ${n} charges` }
  }
})
