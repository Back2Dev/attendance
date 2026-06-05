import { Meteor } from 'meteor/meteor'
import { Mongo, MongoInternals } from 'meteor/mongo'
import MessageTemplates from '/imports/api/message-templates/schema'
import Profiles from '/imports/api/profiles/schema'

const debug = require('debug')('app:migrations')

/*
 * Data migration as required... Migrations will have a finite lifetime,
 * and be removed after some period. To assist with this activity, please
 * add a comment with the following:
 * - Your initials
 * - a date
 * - Why it's there
 *
 * eg // MK 25/1/2021 - Added status, `deleted` is deprecated
 *
 * and a comment at the end of it with END your initials and the date, eg
 * // END MK 25/1/2021
 *
 * Always add new migrations to the end of the file, and we'll remove
 * from the top
 */
Meteor.startup(() => {
  if (Meteor.isServer) {
  }
})

// MK 27/5/2026 - Renamed members collection to profiles, memberId field to profileId across related collections
const migrateToProfiles = async () => {
  // Use Meteor's collection API first — it handles connection readiness internally.
  // If these calls succeed, the raw driver connection is guaranteed to be live.
  const OldMembers = new Mongo.Collection('members')
  const oldCount = await OldMembers.find({}).countAsync()

  if (oldCount === 0) {
    debug('members collection has no data, skipping migration')
    return
  }

  const newCount = await Profiles.find({}).countAsync()

  // Now safe to use the raw driver for operations not available via Meteor's API
  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db

  if (newCount > 0) {
    debug(`profiles already has ${newCount} documents, skipping collection rename`)
  } else {
    await db.collection('members').rename('profiles')
    debug(`Renamed members collection to profiles (${oldCount} documents)`)
  }

  // Rename memberId → profileId in all related collections
  // Note: 'sessions' is listed alongside 'bookings' to cover both pre- and post-rename states
  const relatedCollections = ['sessions', 'bookings', 'purchases', 'products', 'jobs', 'events']
  for (const collName of relatedCollections) {
    const result = await db.collection(collName).updateMany(
      { memberId: { $exists: true } },
      { $rename: { memberId: 'profileId' } }
    )
    if (result.modifiedCount > 0) {
      debug(`Renamed memberId → profileId in ${collName}: ${result.modifiedCount} documents updated`)
    }
  }
}

Meteor.startup(async () => {
  if (Meteor.isServer) {
    await migrateToProfiles().catch((err) =>
      console.error('Migration migrateToProfiles failed', err)
    )
  }
})
// END MK 27/5/2026

// MK 28/5/2026 - Renamed collections: tools→rentals, courses→locations, sessions→bookings
const migrateCollectionNames = async () => {
  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db

  const renames = [
    { from: 'tools', to: 'rentals' },
    { from: 'courses', to: 'locations' },
    { from: 'sessions', to: 'bookings' },
  ]

  for (const { from, to } of renames) {
    const fromCount = await db.collection(from).countDocuments()
    if (fromCount === 0) {
      debug(`${from} collection has no data, skipping rename to ${to}`)
      continue
    }

    const toCount = await db.collection(to).countDocuments()
    if (toCount > 0) {
      debug(`${to} already has ${toCount} documents, skipping rename from ${from}`)
      continue
    }

    await db.collection(from).rename(to)
    debug(`Renamed ${from} → ${to} (${fromCount} documents)`)
  }
}

Meteor.startup(async () => {
  if (Meteor.isServer) {
    await migrateCollectionNames().catch((err) =>
      console.error('Migration migrateCollectionNames failed', err)
    )
  }
})
// END MK 28/5/2026
