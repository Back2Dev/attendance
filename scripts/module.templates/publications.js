import { Meteor } from 'meteor/meteor'
import MyCollection from '../schema'
import '../METHODS_FILE'

Meteor.publish('all.myCollection', () => {
  // Note: We limit to 50 records, because this could be a memory expensive publication
  return MyCollection.find({}, { limit: 50, sort: { createdAt: -1 } })
})

Meteor.publish('id.myCollection', (id) => {
  return [MyCollection.find(id)]
})
