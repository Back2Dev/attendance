import { Meteor } from 'meteor/meteor'
import Tools from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.tools', () => {
  return Tools.find({})
})
