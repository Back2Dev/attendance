import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import Locations from '../schema'
import '../methods'

Meteor.publish('locations.byId', function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  return Locations.find({ _id: id, active: true })
})

Meteor.publish('locations.byIds', function (locationIds) {
  if (!Match.test(locationIds, [String])) {
    return this.ready()
  }
  return Locations.find({ _id: { $in: locationIds }, active: true })
})

Meteor.publish('id.locations', function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  return Locations.find({ _id: id, active: true })
})

Meteor.publish('all.locations', () => {
  return Locations.find({})
})

// Backward-compat aliases for old publication names
Meteor.publish('courses.byId', function (id) {
  if (!Match.test(id, String)) {
    return this.ready()
  }
  return Locations.find({ _id: id, active: true })
})

Meteor.publish('courses.byIds', function (locationIds) {
  if (!Match.test(locationIds, [String])) {
    return this.ready()
  }
  return Locations.find({ _id: { $in: locationIds }, active: true })
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
