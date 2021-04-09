import { Meteor } from 'meteor/meteor'
import Courses from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.courses', () => {
  return Courses.find({})
})
