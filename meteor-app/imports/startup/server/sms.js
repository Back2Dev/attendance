// sms.js
import { Meteor } from 'meteor/meteor'
// import plivo from 'plivo'
import fetch from 'node-fetch'
const debug = require('debug')('att:sms')

const DEFAULT_MESSAGE = 'Hello from plivo. https://app.back2bikes.com.au/'
const DEFAULT_DESTINATION = '0438002921'
Meteor.methods({
  'sendSmsTest'(message = DEFAULT_MESSAGE, destination = DEFAULT_DESTINATION) {
    debug(`Sending message ${message} to ${destination}`)
    try {
      const body = {
        username: 'mikkel',
        password: 'Smsbroadcast.24',
        from: '0416988516',
        to: destination,
        message: message,
      };
      const payload = { 
          method: 'GET',
          // body:    `username=mikkel&password=Smsbroadcast.24&from=0416988516&to=0438002921&message=hello`,    //JSON.stringify(body),
          // body:    JSON.stringify(body),
          // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }      
      fetch('https://api.smsbroadcast.com.au/api-adv.php?username=mikkel&password=Smsbroadcast.24&from=0416988516&to=0438002921&message=hello',payload)
        // .then(res => {debug("Rx",res); return res})
        .then(res => res.text())
        .then(json => debug("Rx",json))
        .catch(err => debug("Error from sms gateway",err));

      // const client = new plivo.Client('MAMMEZMJYYZGE2MWEZNZ','YzBhMGM3MDRhZTAyNWU2NDM0ZDNiMzNhMGY0ZTRm')

      // client.messages.create(
      //   '+61438002921',
      //   destination,
      //   message
      // ).then(function(msg) {
      //   debug(`SMS sent`,msg)
      // })
    } catch (error) {
      debug("Error from sms gateway",error)
    }
	},
})

// https://api.smsbroadcast.com.au/api-adv.php?username=mikkel&password=Smsbroadcast.24&from=0416988516&to=0438002921&message=hello