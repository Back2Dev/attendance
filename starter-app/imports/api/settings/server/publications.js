import { Meteor } from 'meteor/meteor'
import Settings from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.settings', () => {
  return Settings.find({})
})

Meteor.publish('id.settings', (id) => {
  return [
    Settings.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
