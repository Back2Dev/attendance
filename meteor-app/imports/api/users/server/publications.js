import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles'

const publicFields = { username: 1, emails: 1, roles: 1 }

Meteor.publish('getAllUsers', () => {
  return Meteor.users.find({}, { fields: publicFields })
})

Meteor.methods({
  allUsers() {
    Meteor.users.find({})
  },
  updateUserRoles(user) {
    Meteor.users.update(user._id, { $set: { roles: user.roles } })
  },
  deleteUsers(id) {
    Meteor.users.remove(id)
  },
  updateUser(user) {
    Accounts.setUsername(user._id, user.username)
    if (user.oldValue) {
      Accounts.removeEmail(user._id, user.oldValue)
      Accounts.addEmail(user._id, user.emails)
    }
    Roles.setUserRoles(user._id, user.roles)
  },
  addNewUser(func) {
    const id = Accounts.createUser(
      {
        username: 'new user',
        email: 'newUser@peakadventure.com.au',
        password: 'changeme'
      },
      func
    )

    Roles.addUsersToRoles(id, ['signin'])
  },
  setPassword(id, newPassword) {
    Accounts.setPassword(id, newPassword)
  },
  sendResetPasswordEmail(id) {
    Accounts.sendResetPasswordEmail(id)
  }
})
