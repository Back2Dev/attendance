import { Meteor } from 'meteor/meteor'
import Schemas from './schema'
require('debug')('app:schemas')
import { deleteSchema, compileData, initAllSchemaDocuments } from './functions'

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
      return { status: 'success', message: 'Added schema' }
    } catch (e) {
      return {
        status: 'failed',
        message: `Error adding schema: ${e.message}`,
      }
    }
  },
})
