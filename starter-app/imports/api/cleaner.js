/**
 * cleaner
 * utilities for testing
 */

import * as cleaner from 'meteor/xolvio:cleaner'

// reset the database.
// call in beforeEach() when running integration tests.
// eslint-disable-next-line import/prefer-default-export
export function resetDatabase() {
  // exclude kadira collections to prevent errors
  return cleaner.resetDatabase()
}
