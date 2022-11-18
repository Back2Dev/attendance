import { Meteor } from 'meteor/meteor'
import Schemas, { SchemasCollections } from '../schema'
import { compileData, findAllDescendants } from '../functions'
import '../methods'

// db.inventory.find( { tags: { $in: ["red", "blank"] } } )

Meteor.publish('all.schemas', () => {
  return Schemas.find({})
})

Meteor.publish('all.schemas.names', () => {
  return Object.keys(compileData)
})

Meteor.publish('id.schemas', (id) => {
  return [Schemas.find(id)]
})

Meteor.publish('slug.schemas', (slug) => {
  return Schemas.find({
    slug,
  })
})

Meteor.publish('all.schemas.collections', (collection) => {
  return SchemasCollections.find({
    collections: {
      $in: findAllDescendants(collection),
    },
  })
})

Meteor.publish('id.schemas.collections', (id) => {
  return [SchemasCollections.find(id)]
})
