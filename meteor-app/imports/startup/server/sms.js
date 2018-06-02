// sms.js
import { Meteor } from 'meteor/meteor'
// import plivo from 'plivo'
import querystring from 'querystring'
import fetch from 'node-fetch'
const debug = require('debug')('att:sms')

import { eventLog } from '/imports/api/events'
import log from '/imports/lib/log'

const DEFAULT_MESSAGE = 'Hello from back2bikes. https://app.back2bikes.com.au/'
const DEFAULT_DESTINATION = ''

const smsSettings = { enabled: false }

const required = ['USERNAME', 'PASSWORD', 'FROM']

Meteor.startup(() => {
  if (Meteor.settings.env && Meteor.settings.env.SMS) {
    const settings = Meteor.settings.env.SMS
    debug("settings",settings)
    smsSettings.enabled = required.every(item => {
      smsSettings[item] = settings[item]
      if (!settings[item]) {
        debug(`SMS settings are missing SMS.${item}`)
      }
      return settings[item]
    })
  }
  debug("SMS Sending is "+smsSettings.enabled)
})

const SMS_URL = 'https://api.smsbroadcast.com.au/api-adv.php'

Meteor.methods({
  'sendSmsTest'(
    message = DEFAULT_MESSAGE,
    destination = DEFAULT_DESTINATION
  ) {
    if (smsSettings.enabled) {
      debug(`Sending message ${message} to ${destination}`)

      try {
        const body = {
          username: smsSettings.USERNAME,
          password: smsSettings.PASSWORD,
          from: smsSettings.FROM,
          to: destination,
          message: message,
        };
        const payload = {
          method: 'GET',
        }
        let url = SMS_URL
        Object.keys(body).forEach((item, ix) => {
        debug("url=" + url)
          const joiner = (ix === 0) ? '?' : '&'
          url = `${url}${joiner}${item}=${body[item]}`
        })
        debug("url=" + url)
        fetch(url, payload)
          .then(res => res.text())
          .then(data => {
            debug("SMS send response", data)
            eventLog({
              who: destination,
              what: `SMS message: ${message}`,
              object: {
                response: data,
              },
            })
          })
          .catch(error => {
            debug("Error from sms gateway", error)
            eventLog({
              who: destination,
              what: `SMS message: ${message}`,
              object: {
                response: error,
              },
            })
          });
      } catch (error) {
        log.error("Error from sms gateway", error)
      }


      // const client = new plivo.Client('MAMMEZMJYYZGE2MWEZNZ','YzBhMGM3MDRhZTAyNWU2NDM0ZDNiMzNhMGY0ZTRm')


      // client.messages.create(
      //   '+61438002921',
      //   destination,
      //   message
      // ).then(function(msg) {
      //   debug(`SMS sent`,msg)
      // })
    // } catch (error) {
    //   debug("Error from sms gateway", error)
    // }
    }
  },
})

// https://api.smsbroadcast.com.au/api-adv.php?username=mikkel&password=Smsbroadcast.24&from=0416988516&to=0438002921&message=hello
