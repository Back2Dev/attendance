import { Meteor } from 'meteor/meteor'

const publicFields = { username: 1, emails: 1, roles: 1 }

Meteor.publish('getAllUsers', () => {
  return Meteor.users.find({}, { fields: publicFields })
})

Meteor.methods({
  updateUserRoles(user) {
    Meteor.users.update(user._id, { $set: { roles: user.roles } })
  },
  deleteUsers(id) {
    Meteor.users.remove(id)
  },
  updateUser(user) {
    Meteor.users.update(user._id, { $set: user })
  }
})

Meteor.publish('updateUserRoles')
Meteor.publish('deleteUsers')
Meteor.publish('updateUser')
