/**
 * util-test
 * utilities for testing
 */

import * as cleaner from 'meteor/xolvio:cleaner'

// reset the  database.
// call in beforeEach() when running integration tests.
export function resetDatabase(options) {
  // exclude kadira collections to prevent errors
  let excludedCollections = ['__kdtraces', '__kdtimeevents']
  if (options && options.excludedCollections)
    excludedCollections = excludedCollections.concat(options.excludedCollections)
  return cleaner.resetDatabase({ excludedCollections })
}
