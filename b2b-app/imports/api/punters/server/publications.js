import { Meteor } from 'meteor/meteor'
import Punters from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.punters', () => {
  return Punters.find({})
})

Meteor.publish('id.punters', (id) => {
  return [
    Punters.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
