import { Meteor } from 'meteor/meteor'
import Jobs from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.jobs', () => {
  return Jobs.find({})
})

Meteor.publish('id.jobs', (id) => {
  return [
    Jobs.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
