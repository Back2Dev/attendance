// @ts-check
import { Meteor } from 'meteor/meteor'
import Schemas, { SchemasCollections } from './schema'
require('debug')('app:schemas')
import {
  deleteSchema,
  compileData,
  initAllSchemaDocuments,
  compileEditedSchemaDocs,
  performAllDocumentValidations,
} from './functions'

// Initialize all the schemas
initAllSchemaDocuments(Schemas.find({}))

Meteor.methods({
  'rm.schemas': (slug) => {
    try {
      const id = compileData[slug].schema._id
      const childChanges = deleteSchema(slug)
      childChanges.forEach((change) => {
        Schemas.update(change._id, { $set: { extends: change.extends } })
      })
      Schemas.remove(id)
      return { status: 'success', message: 'Removed schema' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing schema: ${e.message}`,
      }
    }
  },
  'update.schemas': (form) => {
    try {
      const id = form._id
      delete form._id
      compileEditedSchemaDocs([form])
      delete form.slug
      const n = Schemas.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} schema(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating schema: ${e.message}`,
      }
    }
  },
  'insert.schemas': (form) => {
    try {
      const id = Schemas.insert(form)
      form._id = id
      compileEditedSchemaDocs([form])
      return { status: 'success', message: 'Added schema' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding schema: ${e.message}`,
      }
    }
  },

  // SCHEMAS_COLLECTIONS
  'rm.schemas.collections': (form) => {
    try {
      SchemasCollections.find(form.id).forEach((doc) => {
        if (
          doc.collections.some((slug) => form.collection === slug) &&
          doc.collections.length === 0
        ) {
          SchemasCollections.remove(form.id)
        } else {
        }
      })
      return { status: 'success', message: 'Removed document' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error removing document: ${e.message}`,
      }
    }
  },
  'update.schemas.collections': (form) => {
    try {
      const id = form._id
      delete form._id
      const document = SchemasCollections.find(id).fetch()[0]
      /**
       * @type {string[]}
       */
      const collections = document.collections
      const isDocumentInCollection = collections.some((slug) => slug === form.collection)
      if (!isDocumentInCollection) {
        collections.push(form.collection)
      }
      const collection = form.collection
      delete form.collection
      const errors = performAllDocumentValidations(true, collection, form, false)

      if (errors.length > 0) {
        throw { message: errors.join(', ') }
      }

      if (!isDocumentInCollection) {
        form.collections = collections
      }

      const n = SchemasCollections.update(id, { $set: form })
      return { status: 'success', message: `Updated ${n} schema(s)` }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error updating schema: ${e.message}`,
      }
    }
  },
  'insert.schemas.collections': (form) => {
    try {
      const collection = form.collection
      delete form.collection
      const errors = performAllDocumentValidations(true, collection, form, true)

      if (errors.length > 0) {
        throw { message: errors.join(', ') }
      }

      form.collections = [collection]

      const id = SchemasCollections.insert(form)
      form._id = id
      return { status: 'success', message: 'Added document' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding schema: ${e.message}`,
      }
    }
  },
})
