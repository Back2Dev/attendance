// cron-jobs.js
import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import Cronjobs from '/imports/api/cronjobs/schema'
import { sendMessages } from '/imports/api/messages/functions'
import logger from '/imports/lib/log'

const cron = require('node-cron')
const debug = require('debug')('app:cron')

const dispatch = (cronjob) => {
  switch (cronjob.type) {
    case 'bot.message.api':
      sendMessages('webhook')
      break
    case 'bot.message.sms':
      sendMessages('sms')
      break
    case 'bot.message.email':
      sendMessages('email')
      break
    default:
      debug(`Unknown cronjob type: ${cronjob.type}`)
  }
}

const running = {}

export const masterTicker = () => {
  try {
    let n = 0
    // const runTime = moment() // Take the timestamp early, to minimise time spent running code
    Cronjobs.find({
      active: true,
      status: 'ready',
      $or: [{ nextRun: { $lte: new Date() } }, { nextRun: null }],
    }).forEach((cronjob) => {
      // Set it to running to avoid double-ups
      Cronjobs.update(cronjob._id, { $set: { status: 'running', lastRun: new Date() } })
      n = n + 1
      const [num, delta] = cronjob.frequency.split(/\s+/g)
      let nextRun = moment().add(num, delta).toDate()
      // Do the work...
      // debug(
      //   `Running ${cronjob.name}, every ${cronjob.frequency}, ${moment(nextRun).format(
      //     'hh:mm:ss'
      //   )}`
      // )
      dispatch(cronjob)

      // Set it back to ready and set the time of the next run
      Cronjobs.update(cronjob._id, {
        $set: { status: 'ready', nextRun },
      })
    })
    // debug(`Tick ${moment().format('hh:mm:ss')}, ran ${n} cronjobs`)
    // Check for long running jobs - do they need to  be rescued?
    Cronjobs.find({
      active: true,
      status: 'running',
    }).forEach((cronjob) => {
      logger.warn(`Cron job [${cronjob.name}] is still running?`)
      running[cronjob.name] = running[cronjob.name] ? running[cronjob.name] + 1 : 1
      if (running[cronjob.name] > 2) {
        logger.warn(`Restarting cronjob [${cronjob.name}]`)
        Cronjobs.update(cronjob._id, { $set: { status: 'ready' } }, { multi: true })
        running[cronjob.name] = 0 // Reset the counter
      }
    })
  } catch (e) {
    console.error(`Error ${e.message} encountered running master ticker`)
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

const CRON_TICKER_INTERVAL = '* * * * *'

Meteor.startup(() => {
  Cronjobs.update(
    { active: true, status: 'running' },
    { $set: { status: 'ready' } },
    { multi: true }
  )
  cron.schedule(CRON_TICKER_INTERVAL, Meteor.bindEnvironment(masterTicker))
})
