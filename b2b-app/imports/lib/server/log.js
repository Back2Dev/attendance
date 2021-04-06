/* eslint-disable no-underscore-dangle */

/**
 * /lib/server/log
 *
 * server-side logging with Winston and Loggly,
 * error handling with Sentry.
 *
 */

import { Meteor } from 'meteor/meteor'
import winston from 'winston'
import 'winston-mongodb'

import { Loggly } from 'winston-loggly-bulk'
import * as Sentry from '@sentry/node'
import { createLog, createAudit } from '/imports/lib/log'

import { version } from '/imports/api/version'

const debug = require('debug')('b2b:log')

const environment = (Meteor.settings.env && Meteor.settings.env.environment) || 'unknown'
if (!environment) {
  console.warn('Unable to parse env.environment from Meteor.settings')
}
const release = version()

/**
 * Attempt to get the current Meteor User
 * @return {Object|Null}
 */
function getUser() {
  try {
    if (!Meteor.userId()) return { _id: 'UNKNOWN', username: 'Not logged in' }
    return Meteor.users.findOne(Meteor.userId())
  } catch (err) {
    return null
  }
}
const getUserId = () => {
  try {
    return Meteor.userId()
  } catch (e) {
    return 'Unknown'
  }
}

/**
 * Configure a Winston instance that logs to the con sole
 * @return {Winston.createLogger}
 */
function configureWinston() {
  const transports = [
    new winston.transports.Console({
      prettyPrint: true, // better json logging
    }),
  ]
  if (!Meteor.isTest && Meteor.settings.log2db) {
    transports.push(
      new winston.transports.MongoDB({
        db: process.env.MONGO_URL,
        collection: 'logs',
        name: 'mongo.logs',
        capped: true,
        cappedMax: 100, //1000 * 1000, // 1 Million log records max
      })
    )
  }
  const level = process.env.LOG_LEVEL || 'info'
  const logger = winston.createLogger({
    level,
    transports,
  })
  logger.log(level, `Winston is logging to console at level ${level}`)
  return Object.create(logger)
}

/**
 * Add Loggly transport to a Winston logger
 */
function configureLoggly(log) {
  const { loggly } = Meteor.settings
  if (!loggly || ['token', 'subdomain'].some((x) => !(x in loggly))) {
    log.warn('Unable to find Loggly configuration in settings. Loggly is NOT running.')
    return log
  }

  const { token, subdomain, level } = loggly

  try {
    log.add(
      new Loggly({
        token,
        subdomain,
        tags: [`env-${environment}`, release],
        json: true,
        level: level || 'info',
      })
    )

    log.info(`Loggly configured for subdomain ${subdomain}`)
    return log
  } catch (err) {
    debug('Error setting up winston-loggly', err)
  }
}

/**
 * Configure Raven/Sentry
 */
function configureSentry(log) {
  const { sentry } = Meteor.settings
  if (!sentry || ['dsn'].some((x) => !(x in sentry))) {
    log.warn('Unable to find Sentry DSN. Sentry is NOT running.')
    return
  }

  Sentry.init(sentry)

  log.info('Sentry configured', {
    environment,
    release,
  })
}

/**
 * Hijack Meteor._debug to send errors to Sentry
 */
function hijackDebug(log) {
  // const legacyDebug = Meteor._debug
  Meteor._debug = function debugOverride(message, stack) {
    debug('hijackdebug intercepted an error with:', {
      message,
      stack,
    })

    if (message || stack) {
      log.error(message, stack)
    }

    // I've disabled this for now because all it seemed to do
    // was log the error to the console again. I was worried that
    // it might prevent Kadira from logging but it LOOKS like
    // Kadira registers first. Will leave it here in case we
    // run into race conditions...
    // legacyDebug.call(this, message, stack)
  }

  // catch unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled promise rejection', reason)
  })
}

/**
 * Log errors and send them to Sentry.
 *
 * Usage:
 *   log.error(Error)
 *   log.error(String, Error)
 *   log.error(String, Object)
 */
function trackErrors(log) {
  log.error = (...args) => {
    // eslint-disable-line no-param-reassign
    const user = getUser()
    const exception = args.find((arg) => arg instanceof Error)

    // use Sentry if it's been configured
    if (Meteor.settings.sentry) {
      if (exception) {
        debug('log.error was passed an exception')
        // we got passed an exception, capture it
        const message = typeof args[0] === 'string' ? args[0] : false
        const extra = message ? { message } : {}
        debug('calling Sentry.captureException() with', {
          exception,
          user,
          extra,
        })
        Sentry.captureException(exception, {
          user,
          extra,
        })
      } else {
        // no exception, use captureMessage instead
        debug('log.error was not passed an exception')
        const message = args[0]
        const extra = {
          data: args[1] || null,
        }
        debug('calling Sentry.captureMessage() with', {
          message,
          user,
          extra,
        })
        Sentry.captureMessage(message, {
          user,
          extra,
        })
      }
    }
    createLog({
      type: 'ERROR',
      data: {
        ...args,
      },
      user: getUserId(),
    })
    return log.log('error', ...args)
  }
}

const log = configureWinston()
log.audit = Meteor.bindEnvironment((event, data) => {
  try {
    const user = getUserId()
    createAudit({
      user,
      event,
      data,
    })
    log.info(`AUDIT (${user}): ${event}`, data)
  } catch (e) {
    console.error(
      `Failed to create audit entry: ${e.message}, event: ${event}, user: ${user}`,
      data
    )
  }
})

configureLoggly(log)
configureSentry(log)
trackErrors(log)
if (!Meteor.isTest) hijackDebug(log)

Meteor.methods({
  triggerSentryError: () => {
    log.error('This is a harmless test error', {
      data: { email: 'mike@me.me', role: 'admin' },
    })
    return true
  },
  triggerException: () => {
    // Members is not imported, so this will  fail
    const userProfile = Members.findOne({
      userIds: getUserId(),
    })
    if (!userProfile.admin) return false
    log.error('This will never be reached', {
      data: { email: 'mike@me.me', role: 'admin' },
    })
    return false
  },
})

export default log
