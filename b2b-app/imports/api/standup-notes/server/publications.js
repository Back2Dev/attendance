import { Meteor } from 'meteor/meteor'
import StandupNotes from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
import Users from '/imports/api/users/schema' 
*/

Meteor.publish('all.standupNotes', () => {
  return StandupNotes.find({})
})

Meteor.publish('id.standupNotes', (id) => {
  return [
    StandupNotes.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
    Users.find({}) 
    */
  ]
})
