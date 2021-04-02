import { Meteor } from 'meteor/meteor'
import MyCollection from '../schema'
import '../METHODS_FILE'
/* Commented out related publications (if any) - best to add these in manually as required
MyPubImports 
*/

Meteor.publish('all.myCollection', () => {
  return MyCollection.find({})
})

Meteor.publish('id.myCollection', (id) => {
  return [
    MyCollection.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
    RelatedPublications 
    */
  ]
})
