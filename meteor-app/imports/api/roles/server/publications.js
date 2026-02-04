import { Meteor } from 'meteor/meteor'

Meteor.publish('getAllRoles', () => {
  return Meteor.roles.find()
})

Meteor.publish('roleAssignments', function () {
  if (!this.userId) return this.ready()
  return Meteor.roleAssignment.find({ 'user._id': this.userId })
})

Meteor.methods({
  addANewRole(id) {
    try {
      return Meteor.roles.insert({ _id: id, children: [] })
    } catch (e) {
      log.error(e)
    }
  },
  removeARole(id) {
    try {
      return Meteor.roles.remove(id)
    } catch (e) {
      log.error(e)
    }
  }
})

Meteor.publish('addANewRole')
Meteor.publish('removeARole')
