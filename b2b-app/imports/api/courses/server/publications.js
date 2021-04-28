import { Meteor } from 'meteor/meteor'
import Courses from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('courses.byIds', function (courseIds) {
  return Courses.find({ _id: { $in: courseIds } })
})

Meteor.publish('all.courses', () => {
  return Courses.find({})
})
Meteor.publish('id.courses', (id) => {
  return [
    Courses.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
