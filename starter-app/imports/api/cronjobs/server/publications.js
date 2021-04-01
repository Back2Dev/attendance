import { Meteor } from 'meteor/meteor'
import Cronjobs from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.cronjobs', () => {
  return Cronjobs.find({})
})

Meteor.publish('id.cronjobs', (id) => {
  return [
    Cronjobs.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
