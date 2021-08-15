import { Meteor } from 'meteor/meteor'
import Collections from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.collections', () => {
  return Collections.find({})
})

Meteor.publish('id.collections', (id) => {
  return [
    Collections.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
