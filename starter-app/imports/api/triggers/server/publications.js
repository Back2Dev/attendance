import { Meteor } from 'meteor/meteor'
import Triggers from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.triggers', () => {
  return Triggers.find({})
})

Meteor.publish('id.triggers', (id) => {
  return [
    Triggers.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
