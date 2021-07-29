/* global Roles */
import { Meteor } from 'meteor/meteor'

import '/imports/api/users/server/publications'

// GENERATED PUBS GO HERE
import '/imports/api/settings/server/publications'
// END GENERATED PUBS

// Import all the things...
import '/imports/startup/server/generated-pubs'

// This gives Mongo time to start up on the CI server, and avoid the "MongoError: not master and slaveOk=false" error

if (Meteor.isTest || Meteor.isAppTest || !process.env.MONGO_URL) {
  console.log('sleep a moment')
  Meteor._sleepForMs(1000)
}

// alanning:roles v3
Meteor.publish(null, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, ['ADM'])) {
      return Meteor.roleAssignment.find({})
    }
    return Meteor.roleAssignment.find({ 'user._id': this.userId })
  } else {
    this.ready()
  }
})

Meteor.publish('currentUser', function (id) {
  return Meteor.users.find({ _id: id }, { fields: { services: 0 } })
})

// super user dashboard

Meteor.publish('users.userDash', function () {
  return Meteor.users.find({}, { services: 0 })
})
