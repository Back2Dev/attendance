import { Meteor } from 'meteor/meteor'
import Diagrams from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.diagrams', () => {
  return Diagrams.find(
    {},
    { fields: { name: 1, slug: 1, createdAt: 1, updatedAt: 1 }, limit: 1000 }
  )
})

Meteor.publish('id.diagrams', (id) => {
  return [
    Diagrams.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
