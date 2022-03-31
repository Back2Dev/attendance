import { Meteor } from 'meteor/meteor'
import Teams from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.teams', () => {
  return Teams.find({})
})

Meteor.publish('id.teams', (id) => {
  return [
    Teams.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
