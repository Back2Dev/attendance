import { Meteor } from 'meteor/meteor'
import Collections from './collection-schema'

Meteor.publish('all.collections', () => {
  return Collections.find({})
})

Meteor.publish('id.collections', (id) => {
  return [Collections.find(id)]
})

Meteor.publish('name.collections', ({ name, query = {} }) => {
  // Get a reference to the collection using the name
  // const collection = Mongo.Collection.get(name)
  return [
    // Return the meta data from this collection
    Collections.find({ name }),
    // Return the data for the target collection
    // collection.find(query),
  ]
})
