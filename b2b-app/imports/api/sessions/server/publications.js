import { Meteor } from 'meteor/meteor'
import Sessions from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.sessions', () => {
  return Sessions.find({})
})
