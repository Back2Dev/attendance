/**
 * cleaner
 * utilities for testing
 */

// reset the database.
// call in beforeEach() when running integration tests.
// eslint-disable-next-line import/prefer-default-export
export function cleanDatabase() {
  // exclude kadira collections to prevent errors
  // TODO: Do the cleaning, but not using this dev-time-only cleaner package
  //  return cleaner.resetDatabase()
}
