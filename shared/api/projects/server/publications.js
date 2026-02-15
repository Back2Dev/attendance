import { Meteor } from 'meteor/meteor'
import Projects from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.projects', () => {
  return Projects.find(
    {},
    { fields: { name: 1, slug: 1, createdAt: 1, updatedAt: 1, diagram: 1 }, limit: 1000 }
  )
})

Meteor.publish('id.projects', (id) => {
  return [
    Projects.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
