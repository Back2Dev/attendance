import { Meteor } from 'meteor/meteor'
import Standups from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
import Teams from '/imports/api/teams/schema' 
*/

Meteor.publish('all.standups', () => {
  return Standups.find({})
})

Meteor.publish('id.standups', (id) => {
  return [
    Standups.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
    Teams.find({}) 
    */
  ]
})
