import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Locations from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('courses.byId', function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  return Locations.find({ _id: id, active: true })
})

Meteor.publish('courses.byIds', function (courseIds) {
  if (!Match.test(courseIds, [String])) {
    return this.ready()
  }
  return Locations.find({ _id: { $in: courseIds }, active: true })
})

Meteor.publish('id.courses', function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  return Locations.find({ _id: id, active: true })
})

Meteor.publish('all.courses', () => {
  return Locations.find({})
})
