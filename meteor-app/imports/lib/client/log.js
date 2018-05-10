/* eslint-disable no-console */

/**
 * clientside logging, just falls back to console methods.
 */


const logger = {
  // debug is no-op on the client
  debug() {},
  info(...args) {
    console.info('INFO', ...args);
  },
  warn(...args) {
    console.warn('WARN', ...args);
  },
  error(...args) {
    console.error('ERROR', ...args);
  },
};

export default logger;
