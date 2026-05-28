import { Meteor } from 'meteor/meteor'
import { Mongo, MongoInternals } from 'meteor/mongo'
import MessageTemplates from '/imports/api/message-templates/schema'
import Profiles from '/imports/api/profiles/schema'
import Products, { ProductTypes } from '/imports/api/products/schema'

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
  const relatedCollections = ['sessions', 'purchases', 'products', 'jobs', 'events']
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

// MK 28/5/2026 - Renamed products.code field to slug
const migrateProductCodeToSlug = async () => {
  // Prime the connection via Meteor's collection API before using the raw driver
  const needsMigration = await Products.find({ code: { $exists: true } }).countAsync()
  if (needsMigration === 0) {
    debug('products.code → slug: nothing to migrate')
    return
  }

  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db

  // Top-level field in products collection
  const productsResult = await db.collection('products').updateMany(
    { code: { $exists: true } },
    { $rename: { code: 'slug' } }
  )
  debug(`products.code → slug: ${productsResult.modifiedCount} product documents updated`)

  // Embedded products array inside carts — $rename doesn't work on array elements,
  // so copy via aggregation pipeline then unset the old field
  await db.collection('carts').updateMany(
    { 'products.code': { $exists: true } },
    [{
      $set: {
        products: {
          $map: {
            input: '$products',
            as: 'p',
            in: { $mergeObjects: ['$$p', { slug: '$$p.code' }] },
          },
        },
      },
    }]
  )
  const cartsResult = await db.collection('carts').updateMany(
    { 'products.code': { $exists: true } },
    { $unset: { 'products.$[].code': '' } }
  )
  debug(`products.code → slug in carts: ${cartsResult.modifiedCount} cart documents updated`)
}

Meteor.startup(async () => {
  if (Meteor.isServer) {
    await migrateProductCodeToSlug().catch((err) =>
      console.error('Migration migrateProductCodeToSlug failed', err)
    )
  }
})
// END MK 28/5/2026

// MK 28/5/2026 - Renamed productTypes.type field to slug
const migrateProductTypeToSlug = async () => {
  const needsMigration = await ProductTypes.find({ type: { $exists: true } }).countAsync()
  if (needsMigration === 0) {
    debug('productTypes.type → slug: nothing to migrate')
    return
  }

  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db
  const result = await db.collection('productTypes').updateMany(
    { type: { $exists: true } },
    { $rename: { type: 'slug' } }
  )
  debug(`productTypes.type → slug: ${result.modifiedCount} documents updated`)
}

Meteor.startup(async () => {
  if (Meteor.isServer) {
    await migrateProductTypeToSlug().catch((err) =>
      console.error('Migration migrateProductTypeToSlug failed', err)
    )
  }
})
// END MK 28/5/2026
