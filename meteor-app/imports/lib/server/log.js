/* eslint-disable no-underscore-dangle */

/**
 * /lib/server/log
 *
 * server-side logging with Winston and Loggly,
 * error handling with Raven/Sentry.
 *
 */

import { Meteor } from 'meteor/meteor';
import winston from 'winston';
import 'winston-loggly-bulk';
import raven from 'raven';
import _ from 'lodash';
import _debug from 'debug';

// import { Profiles } from '/imports/api/collections';
import { version } from '/imports/api/version';

const debug = _debug('mentorloop:log');


const environment = (Meteor.settings.env && Meteor.settings.env.environment) || 'unknown';
if (!environment) {
  console.warn('Unable to parse env.environment from Meteor.settings');
}
const release = version();


/**
 * Attempt to get the current Meteor User
 * @return {Object|Null}
 */
function getUser() {
  try {
    return _.pick(Meteor.user(), ['_id', 'emails']);
  } catch (err) {
    return null;
  }
}

/**
 * Configure a Winston instance that logs to the console
 * @return {Winston.Logger}
 */
function configureWinston() {
  const level = process.env.LOG_LEVEL || 'info';
  const log = new winston.Logger({
    level,
    transports: [
      new winston.transports.Console({
        prettyPrint: true, // better json logging
      }),
    ],
  });
  log.log(level, `Winston is logging to console at level ${level}`);
  return log;
}


/**
 * Add Loggly transport to a Winston logger
 */
function configureLoggly(log) {
  const { loggly } = Meteor.settings;
  if (!loggly || ['token', 'subdomain'].some(x => !(x in loggly))) {
    log.warn('Unable to find Loggly configuration in settings. Loggly is NOT running.');
    return log;
  }

  const { token, subdomain, level } = loggly;

  log.add(winston.transports.Loggly, {
    inputToken: token,
    subdomain,
    tags: [`env-${environment}`, release],
    json: true,
    level: level || 'info',
  });

  log.info('Loggly configured');
  return log;
}

/**
 * Configure Raven/Sentry
 */
function configureSentry(log) {
  const { sentry } = Meteor.settings;
  if (!sentry || ['dsn'].some(x => !(x in sentry))) {
    log.warn('Unable to find Sentry DSN. Sentry is NOT running.');
    return;
  }

  raven.config(Meteor.settings.sentry.dsn, {
    environment,
    release,
  }).install();

  log.info('Sentry configured', {
    environment,
    release,
  });
}


/**
 * Hijack Meteor._debug to send errors to Sentry
 */
function hijackDebug(log) {
  // const legacyDebug = Meteor._debug;
  Meteor._debug = function debugOverride(message, stack) {
    debug('hijackdebug intercepted an error with:', {
      message,
      stack,
    });

    if (message || stack) {
      log.error(message, stack);
    }

    // I've disabled this for now because all it seemed to do
    // was log the error to the console again. I was worried that
    // it might prevent Kadira from logging but it LOOKS like
    // Kadira registers first. Will leave it here in case we
    // run into race conditions...
    // legacyDebug.call(this, message, stack);
  };

  // catch unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled promise rejection', reason);
  });
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
  log.error = (...args) => { // eslint-disable-line no-param-reassign
    const user = getUser();
    const exception = args.find(arg => arg instanceof Error);

    // use raven if it's been configured
    if (raven._enabled) {
      if (exception) {
        debug('log.error was passed an exception');
        // we got passed an exception, capture it
        const message = (typeof args[0] === 'string') ? args[0] : false;
        const extra = message ? { message } : {};
        debug('calling raven.captureException() with', {
          exception,
          user,
          extra,
        });
        raven.captureException(exception, {
          user,
          extra,
        });
      } else {
        // no exception, use captureMessage instead
        debug('log.error was not passed an exception');
        const message = args[0];
        const extra = {
          data: args[1] || null,
        };
        debug('calling raven.captureMessage() with', {
          message,
          user,
          extra,
        });
        raven.captureMessage(message, {
          user,
          extra,
        });
      }
    }
    return log.log('error', ...args);
  };
}


const log = configureWinston();
configureLoggly(log);
configureSentry(log);
trackErrors(log);
hijackDebug(log);


Meteor.methods({
  // triggerSentryError: () => {
  //   const userProfile = Profiles.findOne({
  //     userIds: Meteor.userId(),
  //   });
  //   if (!userProfile.admin) return false;
  //   log.error('This is a harmless test error');
  //   return true;
  // },
});


export default log;
