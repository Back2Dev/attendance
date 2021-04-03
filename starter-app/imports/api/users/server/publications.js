import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import { Random } from 'meteor/random'
import { Roles } from 'meteor/alanning:roles'
import Profiles from '/imports/api/profiles/schema'
import { getUserEmailAddress } from '/imports/api/users/utils.js'
import moment from 'moment'
import log from '/imports/lib/log'
const debug = require('debug')('b2b:users')

const publicFields = { username: 1, emails: 1, roles: 1 }

Meteor.publish('getAllUsers', () => {
  return Meteor.users.find({}, { fields: publicFields })
})

Meteor.methods({
  allUsers() {
    Meteor.users.find({})
  },
  getUserFromToken(token) {
    let email
    let mobile
    let name

    const user = Meteor.users.findOne(
      { 'services.email.invitationToken.token': token },
      { fields: { _id: 1, username: 1 } }
    )
    if (!user) {
      return { status: 'failed', message: `Failed to find user with token${token}` }
    }
    const profile = Profiles.findOne(
      { userId: user._id },
      { fields: { name: 1, mobile: 1 } }
    )

    if (!profile) {
      return {
        status: 'failed',
        message: `Failed to find profile with user id ${user._id}`,
      }
    }

    let userId = user._id
    email = user.username
    name = profile.name
    mobile = profile.mobile

    return {
      status: 'success',
      message: 'Successfully retrieved invited users details',
      userId,
      email,
      name,
      mobile,
    }
  },
  verifyUser({ userId, password, token }) {
    const user = Meteor.users.findOne({ _id: userId })
    const confirmationToken = user.services.email.confirmationToken
    const findEmail = user.emails.find(
      (emailObj) => emailObj.address === confirmationToken.email
    )
    if (
      !user ||
      !confirmationToken.token === token ||
      findEmail.verified ||
      moment(confirmationToken.expiryAt).isBefore()
    ) {
      throw new Meteor.Error(403, 'Verify email link expired')
    } else {
      Accounts.setPassword(userId, password)
      Meteor.users.update(
        {
          _id: userId,
          'emails.address': confirmationToken.email,
        },
        {
          $set: { 'emails.$.verified': true },
          $unset: {
            'services.email.confirmationToken': '',
          },
        }
      )
      Profiles.update({ userId }, { $set: { status: 'active' } })
      return { status: 'success', message: 'Confirmed email and password' }
    }
  },
  updateUserRoles(user) {
    try {
      Meteor.users.update(user._id, { $set: { roles: user.roles } })
      return { status: 'success', message: 'Updated user roles' }
    } catch (e) {
      return { status: 'failed', message: `Error updating user roles: ${e.message}` }
    }
  },
  deleteUsers(id) {
    try {
      Meteor.users.remove(id)
      return { status: 'success', message: 'deleted user' }
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
      return { status: 'success', message: 'Updated user' }
    } catch (e) {
      return { status: 'failed', message: `Error updating user: ${e.message}` }
    }
  },
  updateMemberPassword(formData, confirmPass) {
    const userId = formData.userId
    if (Meteor.user()) {
      const oldEmail = Meteor.user().emails
      try {
        // update member form
        Meteor.call('members.update', formData._id, formData)
        // update user password
        Accounts.setPassword(userId, confirmPass, { logout: false })
        // update user email
        Accounts.setUsername(userId, formData.email)
        if (oldEmail) {
          Accounts.removeEmail(userId, oldEmail[0].address)
          Accounts.addEmail(userId, formData.email)
        }
        return { status: 'success', message: 'Updated user' }
      } catch (e) {
        return { status: 'failed', message: `Error updating user: ${e.message}` }
      }
    } else {
      return { status: 'success', message: 'No user associated with account' }
    }
  },
  setUserPassword({ id, newPassword }) {
    try {
      Accounts.setPassword(id, newPassword)
      return { status: 'success', message: 'Updated password' }
    } catch (e) {
      return { status: 'failed', message: `Error updating user: ${e.message}` }
    }
  },
  setOwnPassword({ password, oldPassword }, logout = true) {
    const { userId } = this
    if (!userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const user = Meteor.user()
    try {
      if (oldPassword) {
        const verifyResult = Accounts._checkPassword(user, oldPassword)
        if (verifyResult.error) {
          throw new Meteor.Error('An error has occurred')
        }
      }
    } catch (e) {
      throw new Meteor.Error(e.message)
    }

    try {
      Accounts.setPassword(userId, password, { logout: logout })
      const user = Meteor.user()
      const profile = Profiles.findOne({ userId }, { fields: { name: 1, avatar: 1 } })
      Meteor.call('sendTrigger', { slug: 'password-changed', user, profile })
    } catch (e) {
      throw new Meteor.Error(e.message)
    }
  },
  verifyPassword(password) {
    if (this.userId) {
      let user = Meteor.user()
      let result = Accounts._checkPassword(user, password)
      if (result.error) {
        throw new Meteor.Error(result.error.reason)
      }
    } else {
      throw new Meteor.Error('No user found')
    }
  },
  userServices() {
    let user = Meteor.user()
    const services = user.services
    return Object.keys(services)
  },
  sendResetPasswordEmail: function (email) {
    if (!Match.test(email, String)) {
      return { status: 'failed', message: 'invalid email' }
    }
    try {
      const user = Accounts.findUserByEmail(email)
      if (!user) return log.error(`No user found with email ${email}`)

      if (user && user.services.password) {
        const token = Random.secret()
        const tokenRecord = {
          token,
          email,
          createdAt: new Date(),
          expiryAt: moment().add(1, 'days').toDate(),
        }
        const profile =
          Profiles.findOne({ userId: user._id }, { fields: { name: 1 } }) || []
        user.name = profile.name || 'User'

        Meteor.users.update(
          { _id: user._id },
          { $set: { 'services.password.forgotPassToken': tokenRecord } }
        )
        return Meteor.call('sendTrigger', {
          profile,
          user,
          slug: 'reset-password',
          emailLink: Meteor.absoluteUrl(`reset-password/${user._id}/${token}`),
        })
      } else {
        log.warn(`Reset password: Could not find user ${email}`)
        debug(`Reset password: Could not find user ${email}`)
      }
    } catch (e) {
      throw new Meteor.Error(`method sendResetPasswordEmail failed: ${e.message}`)
    }
  },
  resetUserPassword: function (password, userId, token) {
    try {
      // different to the 'setPassword' method as it needs  a token
      const user = Meteor.users.findOne({ _id: userId })
      const userToken = user.services.password.forgotPassToken

      if (!user || token !== userToken.token || moment(userToken.expiryAt).isBefore()) {
        throw new Meteor.Error('Email link expired')
      } else {
        Accounts.setPassword(userId, password)
        Meteor.users.update(
          { _id: userId },
          { $unset: { 'services.password.forgotPassToken': '' } }
        )
        const profile = Profiles.findOne({ userId }, { fields: { name: 1, avatar: 1 } })

        Meteor.call('sendTrigger', { slug: 'password-changed', user, profile })
      }
    } catch (e) {
      throw new Meteor.Error('Your email link may have expired')
    }
  },
  addNewUser({ email, password, roles, mobile, name, serial }) {
    try {
      const exist = Accounts.findUserByEmail(email) // Checks for existing user by email
      if (exist)
        return { status: 'failed', message: 'A user with this email already exists' }
      if (!password) password = 'Password1'
      if (roles.length < 1) roles.push('CUS') // if form does have any roles attached
      const userId = Accounts.createUser({ email, username: email, password })
      if (userId) {
        Roles.addUsersToRoles(userId, roles)
        Profiles.insert({
          userId,
          name: name,
          nickname: name.split(' ')[0] || name,
          mobile: mobile,
          serial: serial,
          notifyBy: ['EMAIL', 'SMS'],
        })
      }
      return { status: 'success', message: 'Added user account', userId }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }
  },
  editUserProfile({ name, nickname, mobile, sms }) {
    try {
      const user = Meteor.user()
      const userId = user._id
      const profile = Profiles.findOne({ userId })
      const newProfile = {
        userId,
        name,
        nickname,
        mobile,
        notifyBy: sms ? ['EMAIL', 'SMS'] : ['EMAIL'],
      }
      if (profile) {
        Profiles.update(
          { userId },
          {
            $set: newProfile,
          }
        )
      } else {
        if (!newProfile.nickname) {
          newProfile.nickname = newProfile.name.split(' ')[0] || newProfile.name
        }
        Profiles.insert(newProfile)
      }
      return { status: 'success', message: 'Added user account' }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }
  },
  signup({ email, name, mobile }) {
    try {
      const roles = ['CUS']
      const token = Random.secret()
      const tokenRecord = {
        token,
        email,
        createdAt: new Date(),
        expiryAt: moment().add(3, 'days').toDate(),
      }
      const userId = Accounts.createUser({
        email,
        username: email,
      })
      if (userId) {
        Meteor.users.update(
          { _id: userId },
          { $set: { 'services.email.confirmationToken': tokenRecord } }
        )
        Roles.addUsersToRoles(userId, roles)
        Profiles.insert({
          userId,
          name,
          nickname: name.split(' ')[0] || name,
          mobile: mobile,
          notifyBy: ['EMAIL', 'SMS'],
        })
        const user = Meteor.users.findOne({ _id: userId })
        const profile = Profiles.findOne({ userId })
        const admins = Meteor.users.find({ 'roles._id': 'ADM' }).fetch()

        Meteor.call('sendTrigger', {
          profile,
          user,
          slug: 'signup',
          people: admins,
          emailLink: Meteor.absoluteUrl(`signed-up/${userId}/${token}`),
        })
      }
      return userId
    } catch (error) {
      throw new Meteor.Error(error.message)
    }
  },

  userExists(email) {
    // if logged in, check if the username is the logged in one and do nothing if it's the same
    if (this.userId) {
      let user = Meteor.user()
      if (user.emails[0].address === email) {
        return
      }
    }
    if (Meteor.users.findOne({ 'emails.0.address': email })) {
      throw new Meteor.Error('A user with email ' + email + ' already exists')
    }
  },
  updateGoogle({ id, google }) {
    try {
      Meteor.users.update(
        { _id: id },
        {
          $set: {
            'services.google': google,
          },
        }
      )
      return { status: 'success', message: 'Added Google to user account' }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }
  },
  updateFacebook({ id, facebook }) {
    try {
      Meteor.users.update(
        { _id: id },
        {
          $set: {
            'services.facebook': facebook,
          },
        }
      )
      return { status: 'success', message: 'Added Facebook to user account' }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }
  },
})
