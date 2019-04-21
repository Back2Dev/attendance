import { Meteor } from 'meteor/meteor' // base
import moment from 'moment'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import axios from 'axios'

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
      debug(response.data.response)
      return response.data.response
    } catch (error) {
      debug(error)
      // throw new Meteor.Error(error.message)
      return error.message
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
    debug(`Sending charge to ${customerURL}`, request)
    try {
      const response = await axios(request)
      debug(response)
      return response
    } catch (error) {
      debug(error)
      // throw new Meteor.Error(error.message)
      return error.message
    }
  }
})
