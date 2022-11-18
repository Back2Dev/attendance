import { Meteor } from 'meteor/meteor'
import Schemas from '../schema'
import { compileData } from '../functions'
import '../methods'

Meteor.publish('all.schemas', () => {
  return Schemas.find({})
})

Meteor.publish('all.schemas.names', () => {
  return Object.keys(compileData)
})

Meteor.publish('id.schemas', (id) => {
  return [Schemas.find(id)]
})
