/**
 * lib/validator
 * tool for validating the documents in a collection against a schema
 */

import { Meteor } from 'meteor/meteor'
import _debug from 'debug'
import { check } from 'meteor/check'

import Members, { MembersSchema } from '/imports/api/members/members'
import Sessions, { SessionsSchema } from '/imports/api/sessions/sessions'
import Events, { EventsSchema } from '/imports/api/events'
// import { checkSuperAdmin } from '/imports/api/util-auth'

const debug = _debug('att:validator')

const collectionSchemaMap = {
  members: {
    collection: Members,
    schema: MembersSchema,
  },
  sessions: {
    collection: Sessions,
    schema: SessionsSchema,
  },
  events: {
    collection: Events,
    schema: EventsSchema,
  },
}

/**
 * Script that validates all the documents in a Collection
 * against a SimpleSchema.
 * @param  {Meteor.Collection} collection
 * @param  {SimpleSchema} schema
 * @return {Object}
 */
function validateCollection(collection, schema, collectionName) {
  debug(`validating collection ${collection._name}...`) // eslint-disable-line no-underscore-dangle

  const docs = collection.find()
  const invalidDocuments = []
  docs.forEach((doc) => {
    // debug(`validating ${collectionName} ${doc._id}`)
    const context = schema.newContext()
    const result = context.validate(Object.assign({}, doc))
    if (!result) {
      debug(`validation failed for ${collectionName} _id: ${doc._id}`)
      invalidDocuments.push({
        _id: doc._id,
        invalidKeys: context.validationErrors(),
      })
    }
  })
  debug(`validated ${docs.count()} ${collectionName} documents...`)
  debug(`${invalidDocuments.length} invalid ${collectionName} documents found`)

  let summary = {}
  if (invalidDocuments.length) {
    summary = invalidDocuments.reduce((acc, result) => {
      const { invalidKeys } = result
      invalidKeys.forEach(({ name, type, value }) => {
        const key = `${name} ${type} ${value}`
        acc[key] = acc[key] ? acc[key] + 1 : 1
      })
      return acc
    }, {})
    const legend = "How to read... the object below is like this:\n   '<fieldname> <errortype> <value>': <error-count>\n"
    debug(legend, summary)
  }

  return {
    summary,
    invalidDocuments,
  }
}


Meteor.methods({
  validateCollection: (collectionName) => {
    check(collectionName, String)
    // checkSuperAdmin()

    const colSchema = collectionSchemaMap[collectionName]
    if (!colSchema) throw new Meteor.Error(404)
    const { collection, schema } = colSchema

    if (Meteor.isClient) return false

    return validateCollection(collection, schema, collectionName)
  },
})

export default validateCollection
