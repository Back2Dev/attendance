// cron-jobs.js
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

const cron = require('node-cron')
const debug = require('debug')('b2b:cron')

import log from '/imports/lib/log'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'

Meteor.methods({})

const signoutTicker = () => {
  const hour = moment().hour()
  debug(`Tick ${hour}:00`)

  try {
    let n = 0
    crew = Members.find({ isHere: true })
    crew.forEach(dude => {
      const stillHereQuery = {
        memberId: dude._id,
      }
      debug('stillHereQuery', stillHereQuery)
      Sessions.find(stillHereQuery, {
        sort: { createdAt: -1 },
        limit: 1,
      }).forEach(session => {
        console.log('timeOut', session.timeOut)
        console.log('now',moment().toDate(),moment().isAfter(session.timeOut))
        console.log('now.utc2',moment(),moment().utc().isAfter(moment(session.timeOut).utc()))
        console.log('now.utc', moment().utc().toDate(),)
        if (
          moment()
            .utc()
            .isAfter(session.timeOut)
        ) {
          console.log(`Automatically signed out ${dude.name}`)
          n += Members.update(dude._id, { $set: { isHere: false } })
        }
      })
    })
    if (n) {
      debug(`Signed out ${n} members`)
    }
  } catch (error) {
    console.error(`Error ${error.message} encountered signing members out`)
  }
}

//
// These are cron-style time specifiers
//
//                       ┌───────────── minute (0 - 59)
//                       │ ┌───────────── hour (0 - 23)
//                       │ │ ┌───────────── day of month (1 - 31)
//                       │ │ │ ┌───────────── month (1 - 12)
//                       │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
//                       │ │ │ │ │                                       7 is also Sunday on some systems)
//                       │ │ │ │ │
//                       │ │ │ │ │
//                       * * * * *

const TICKER_INTERVAL = '1,16,31,46 * * * *'
// const TICKER_INTERVAL = '* * * * *'

Meteor.startup(() => {
  cron.schedule(TICKER_INTERVAL, Meteor.bindEnvironment(signoutTicker))
})
