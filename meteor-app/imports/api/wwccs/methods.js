import { Meteor } from 'meteor/meteor'
import axios from 'axios'
import fetch from 'node-fetch'
const { URLSearchParams } = require('url')

import Wwccs from '/imports/api/wwccs/schema'
import Members from '/imports/api/members/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:wwcc')

/*
 * This is a bit of a hack. I have asked for access to an official API at
 */
const WWCC_URL = 'https://online.justice.vic.gov.au/wwccu/checkstatus.doj'

// Regex for a succcess message
const matchre = /Working with Children Check number (\w+) \((\w+)\) for (.*?) is current. This person may engage in child related work and their card expires on (.*?)\./i
const searches = [
  {
    re: /This family name and application\/card number combination do not match/i,
    result: false,
    message: 'This family name and application/card number combination do not match'
  },
  {
    re: matchre,
    result: true,
    message: 'Valid'
  },
  {
    re: /There was a problem submitting your request, one or more fields are missing or incorrect/i,
    result: false,
    message: 'There was a problem submitting your request, one or more fields are missing or incorrect'
  }
]
Meteor.methods({
  'members.checkWwcc': async (id, wwccNo, name) => {
    const wwccSurname = name.split(/\s+/).pop()
    const params = new URLSearchParams()
    const data = {
      viewSequence: '1',
      language: 'en',
      cardnumber: wwccNo.replace(/-.*$/, ''),
      pageAction: 'Submit',
      Submit: 'submit',
      lastname: wwccSurname
    }
    Object.keys(data).forEach(key => {
      params.append(key, data[key])
    })

    // Call the remote WWCC api
    const request = {
      url: WWCC_URL,
      method: 'post',

      responseType: 'text',
      validateStatus: function(status) {
        return status >= 200
      },

      transformResponse: [
        function(data) {
          // Do whatever you want to transform the data
          // debug('intercepted data', data)
          return data
        }
      ]
    }
    debug(`Checking WWCC ${WWCC_URL}`, id, wwccNo, name)
    try {
      const res = await fetch(WWCC_URL, { method: 'POST', body: params })
      const response = await res.text()
      let stopping = false
      const buf = response
        .split(/\n/)
        .reduce((acc, line) => {
          if (!acc && line.match(/FORM_LEVEL_ERROR_MARKER/)) return ' '
          if (acc) {
            if (line.match('checkstatus_form')) stopping = true
            if (!stopping) return acc + '\n' + line
            return acc
          }
        }, null)
        .replace(/<\/?[^>]+(>|$)/g, '')
        .trim()
      debug('response', buf)
      const index = searches.reduce((acc, search, ix) => {
        if (buf.match(search.re)) {
          return ix
        }
        return acc
      }, -1)
      debug(`Match ${index} `)
      const wwccOk = index === -1 ? false : searches[index].result
      let wwccExpiry = ''
      if (wwccOk) {
        const m = buf.match(matchre)
        wwccExpiry = m[4]
      }
      const wwccError = wwccOk ? '' : searches[index].message
      // Update the WWCC information in the member record
      Members.update(id, {
        $set: {
          wwccOk,
          wwccError,
          wwccExpiry,
          wwcc: wwccNo,
          wwccSurname
        }
      })
      // Keep a record of the check for posterity...
      Wwccs.insert({
        memberId: id,
        wwccOk,
        wwccError,
        wwccExpiry,
        wwcc: wwccNo,
        wwccSurname
      })
      return wwccError ? `Error: ${wwccError}` : `WWCC is valid, expires ${wwccExpiry}`
    } catch (error) {
      debug(error.message)
      // throw new Meteor.Error(error.message)
      return `Error: ${error.message}`
    }
  },

  'wwccs.insert'(wwcc) {
    try {
      return Wwccs.insert(wwcc)
    } catch (e) {
      log.error(e)
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  }
})
