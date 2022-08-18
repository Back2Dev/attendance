import { Meteor } from 'meteor/meteor'
import Schemas from '../schema'
import '../methods'

Meteor.publish('all.schemas', () => {
  return Schemas.find({})
})

Meteor.publish('id.schemas', (id) => {
  return [Schemas.find(id)]
})
