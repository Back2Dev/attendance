/**
 * util-test
 * utilities for testing
 */

import * as cleaner from 'meteor/xolvio:cleaner';

// reset the database.
// call in beforeEach() when running integration tests.
export function resetDatabase() {
  // exclude kadira collections to prevent errors
  return cleaner.resetDatabase({ excludedCollections: ['__kdtraces', '__kdtimeevents'] });
}
