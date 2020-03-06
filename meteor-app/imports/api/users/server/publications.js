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
    try {
      Meteor.users.update(user._id, { $set: { roles: user.roles } })
      return { status: 'success', message: `Updated user roles` }
    } catch (e) {
      return { status: 'failed', message: `Error updating user roles: ${e.message}` }
    }
  },
  deleteUsers(id) {
    try {
      Meteor.users.remove(id)
      return { status: 'success', message: `deleted user` }
    } catch (e) {
      return { status: 'failed', message: `Error deleting user: ${e.message}` }
    }
  },
  updateUser(user) {
    try {
      Accounts.setUsername(user._id, user.username)
      if (user.oldValue) {
        Accounts.removeEmail(user._id, user.oldValue)
        Accounts.addEmail(user._id, user.emails)
      }
      Roles.setUserRoles(user._id, user.roles)
      return { status: 'success', message: `Updated user` }
    } catch (e) {
      return { status: 'failed', message: `Error updating user: ${e.message}` }
    }
  },
  addNewUser(func) {
    try {
      const id = Accounts.createUser(
        {
          username: 'new user',
          email: 'newUser@peakadventure.com.au',
          password: 'changeme'
        },
        func
      )

      Roles.addUsersToRoles(id, ['signin'])
      return { status: 'success', message: `Added new user` }
    } catch (e) {
      return { status: 'failed', message: `Error adding user: ${e.message}` }
    }
  },
  setPassword({ id, newPassword }) {
    try {
      Accounts.setPassword(id, newPassword)
      return { status: 'success', message: `Updated password` }
    } catch (e) {
      return { status: 'failed', message: `Error updating user: ${e.message}` }
    }
  },
  sendResetPasswordEmail(id) {
    try {
      Accounts.sendResetPasswordEmail(id)

      return { status: 'success', message: `Sent password reset email` }
    } catch (e) {
      return { status: 'failed', message: `Error sending password reset: ${e.message}` }
    }
  }
})
