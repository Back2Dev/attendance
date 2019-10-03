import { Meteor } from 'meteor/meteor'
import axios from 'axios'
import fetch from 'node-fetch'
const { URLSearchParams } = require('url');

import Wwccs from '/imports/api/wwccs/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:wwcc')

const WWCC_URL = 'https://online.justice.vic.gov.au/wwccu/checkstatus.doj'

const searches = [
  { re: /This family name and application\/card number combination do not match/i, result: false },
  { re: /Working with Children Check number (\d+) \((\w+)\) for (.*?) is current. This person may engage in child related work and their card expires on (.*?)\./, result: true },

]
Meteor.methods({
  'members.checkWwcc': async (id, wwccNo, name) => {

    const surname = name.split(/\s+/).pop()
    const params = new URLSearchParams();
    const data = {
      viewSequence: "1",
      language: 'en',
      cardnumber: wwccNo,
      pageAction: "Submit",
      Submit: "submit",
      lastname: surname
    }
    Object.keys(data).forEach(key => {
      params.append(key, data[key])
    })

    // Call the remote WWCC api
    const request = {
      url: WWCC_URL,
      method: 'post',

      responseType: 'text',
      validateStatus: function (status) {
        return status >= 200
      },

      transformResponse: [
        function (data) {
          // Do whatever you want to transform the data
          // debug('intercepted data', data)
          return data
        }
      ]
    }
    debug(`Checking WWCC ${WWCC_URL}`, request)
    try {
      fetch(WWCC_URL, { method: 'POST', body: params })
        .then(res => res.text())
        .then(response => {
          debug('response', response)
          const result = searches.reduce((acc, search, ix) => {
            if (response.match(search.re)) {
              return ix
            }
          }, -1)
          debug(`Match ${result}`)
          Members.update(id, {
            $set: {
              wwccOk: searches[result]
            }
          })
        })
    } catch (error) {
      debug(error)
      // throw new Meteor.Error(error.message)
      return `WWCC error: ${error.message}`
    }
  },

  'wwccs.insert'(wwcc) {
    try {
      return Wwccs.insert(wwcc)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
})
