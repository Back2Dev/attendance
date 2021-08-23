import { Meteor } from 'meteor/meteor'
import Forms from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.forms', () => {
  return Forms.find({})
})

Meteor.publish('id.forms', (id) => {
  return [
    Forms.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
