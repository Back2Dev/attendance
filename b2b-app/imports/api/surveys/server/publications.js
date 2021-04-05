import { Meteor } from 'meteor/meteor'
import Surveys from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.surveys', () => {
  return Surveys.find({})
})

Meteor.publish('id.surveys', (id) => {
  return [
    Surveys.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
