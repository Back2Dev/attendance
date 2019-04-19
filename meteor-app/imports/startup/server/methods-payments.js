import { Meteor } from 'meteor/meteor' // base
import moment from 'moment'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import axios from 'axios'

const debug = require('debug')('b2b:payments')

Meteor.methods({
  makePayment: function(chargeData) {
    const paymentURL = Meteor.settings.private.paymentURL
    const request = {
      url: paymentURL,
      method: 'post',
      data: chargeData,
      auth: {
        username: Meteor.settings.private.paymentApiKey,
        password: ''
      }
    }
    debug(`Sending charge to ${paymentURL}`, request)
    axios(request)
      .then(function(response) {
        debug(response.data.response)
      })
      .catch(function(error) {
        debug(error)
      })
  }
})
