import { Meteor } from 'meteor/meteor'
import Schemas from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.schemas', () => {
  return Schemas.find({})
})

Meteor.publish('id.schemas', (id) => {
  return [
    Schemas.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
