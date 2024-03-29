import { Meteor } from 'meteor/meteor'
import ServiceItems from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.serviceItems', () => {
  return ServiceItems.find({})
})

Meteor.publish('id.serviceItems', (id) => {
  return [
    ServiceItems.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
