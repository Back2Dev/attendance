/**
 * util-test
 * utilities for testing
 */
import { Meteor } from 'meteor/meteor'
import { MongoInternals } from 'meteor/mongo'

// reset the  database.
// call in beforeEach() when running integration tests.
// (replaces xolvio:cleaner, which relies on fibers and doesn't work on Meteor 3)
export async function resetDatabase(options) {
  if (!Meteor.isServer) return
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('resetDatabase is not allowed outside of a development mode. Aborting.')
  }
  // exclude kadira collections to prevent errors
  let excludedCollections = ['system.indexes', '__kdtraces', '__kdtimetriggers']
  if (options && options.excludedCollections)
    excludedCollections = excludedCollections.concat(options.excludedCollections)
  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db
  const collections = await db.collections()
  await Promise.all(
    collections
      .filter(
        (col) =>
          !col.collectionName.startsWith('velocity') &&
          !excludedCollections.includes(col.collectionName)
      )
      .map((col) => col.deleteMany({}))
  )
}
