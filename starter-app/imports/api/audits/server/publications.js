import { Meteor } from 'meteor/meteor'
import Audits from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.audits', () => {
  return Audits.find({})
})

Meteor.publish('id.audits', (id) => {
  return [
    Audits.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
