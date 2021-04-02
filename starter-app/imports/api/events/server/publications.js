import { Meteor } from 'meteor/meteor'
import Events from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.events', () => {
  return Events.find({})
})

Meteor.publish('id.events', (id) => {
  return [
    Events.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
