/* global Roles */
import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import { Random } from 'meteor/random'
import Profiles from '/imports/api/profiles/schema'
import Messages from '/imports/api/messages/schema'
import moment from 'moment'
import '/server/methods'
import log from '/imports/lib/log'
import Events, { MemberItemSchema } from '../../events/schema'
const debug = require('debug')('app:users')

const publicFields = { username: 1, emails: 1, roles: 1 }

const fetchCursor = (cursor) => (cursor.fetchAsync ? cursor.fetchAsync() : cursor.fetch())
const findUserByEmail = (...args) =>
  Accounts.findUserByEmailAsync
    ? Accounts.findUserByEmailAsync(...args)
    : Accounts.findUserByEmail(...args)
const setPassword = (...args) =>
  Accounts.setPasswordAsync ? Accounts.setPasswordAsync(...args) : Accounts.setPassword(...args)
const setUsername = (...args) =>
  Accounts.setUsernameAsync ? Accounts.setUsernameAsync(...args) : Accounts.setUsername(...args)
const addEmail = (...args) =>
  Accounts.addEmailAsync ? Accounts.addEmailAsync(...args) : Accounts.addEmail(...args)
const removeEmail = (...args) =>
  Accounts.removeEmailAsync ? Accounts.removeEmailAsync(...args) : Accounts.removeEmail(...args)
const createUser = (...args) =>
  Accounts.createUserAsync ? Accounts.createUserAsync(...args) : Accounts.createUser(...args)
const checkPassword = (...args) =>
  Accounts._checkPasswordAsync
    ? Accounts._checkPasswordAsync(...args)
    : Accounts._checkPassword(...args)

Meteor.publish('getAllUsers', () => {
  return [
    Meteor.users.find({}, { fields: publicFields }),
    Profiles.find(
      {},
      {
        fields: {
          name: 1,
          mobile: 1,
          userId: 1,
          status: 1,
        },
      }
    ),
  ]
})

Meteor.publish('getUser', (userId) => {
  return [
    Meteor.users.find(
      { _id: userId },
      { fields: { username: 1, roles: 1, services: 1 } }
    ),
    Profiles.find(
      { userId },
      {
        fields: {
          name: 1,
          mobile: 1,
          createdAt: 1,
          userId: 1,
          status: 1,
          nickname: 1,
          onlineStatus: 1,
          notifyBy: 1,
        },
      }
    ),
    // TODO: limit messages to user
    Messages.find(
      { recipientId: userId },
      {
        fields: {
          createdAt: 1,
          type: 1,
          to: 1,
          subject: 1,
          status: 1,
          body: 1,
        },
      }
    ),
  ]
})

Meteor.methods({
  async allUsers() {
    return fetchCursor(Meteor.users.find({}, { fields: publicFields }))
  },
  async getUserFromToken(token) {
    let email
    let mobile
    let name

    const user = await Meteor.users.findOneAsync(
      { 'services.email.invitationToken.token': token },
      { fields: { _id: 1, username: 1 } }
    )
    if (!user) {
      return { status: 'failed', message: `Failed to find user with token${token}` }
    }
    const member = await Profiles.findOneAsync(
      { userId: user._id },
      { fields: { name: 1, mobile: 1 } }
    )

    if (!member) {
      return {
        status: 'failed',
        message: `Failed to find member with user id ${user._id}`,
      }
    }

    const userId = user._id
    email = user.username
    name = member.name
    mobile = member.mobile

    return {
      status: 'success',
      message: 'Successfully retrieved invited users details',
      userId,
      email,
      name,
      mobile,
    }
  },
  async verifyUser({ userId, password, token }) {
    const user = await Meteor.users.findOneAsync({ _id: userId })
    const confirmationToken = user?.services?.email?.confirmationToken
    const findEmail = user?.emails?.find(
      (emailObj) => emailObj.address === confirmationToken?.email
    )
    if (
      !user ||
      confirmationToken?.token !== token ||
      findEmail?.verified ||
      moment(confirmationToken?.expiryAt).isBefore()
    ) {
      throw new Meteor.Error(403, 'Verify email link expired')
    } else {
      await setPassword(userId, password)
      await Meteor.users.updateAsync(
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
      await Profiles.updateAsync({ userId }, { $set: { status: 'active' } })
      return { status: 'success', message: 'Confirmed email and password' }
    }
  },
  async updateUserRoles(user) {
    try {
      await Roles.setUserRoles(user._id, user.roles)
      return { status: 'success', message: 'Updated user roles' }
    } catch (e) {
      return { status: 'failed', message: `Error updating user roles: ${e.message}` }
    }
  },
  async deleteUsers(id) {
    try {
      await Meteor.users.removeAsync(id)
      return { status: 'success', message: 'deleted user' }
    } catch (e) {
      return { status: 'failed', message: `Error deleting user: ${e.message}` }
    }
  },
  async updateUser(user) {
    try {
      await setUsername(user._id, user.username)
      if (user.oldValue) {
        await removeEmail(user._id, user.oldValue)
        await addEmail(user._id, user.emails)
      }
      await Roles.setUserRoles(user._id, user.roles)
      return { status: 'success', message: 'Updated user' }
    } catch (e) {
      return { status: 'failed', message: `Error updating user: ${e.message}` }
    }
  },
  async updateMemberPassword(formData, confirmPass) {
    const userId = formData.userId
    if (this.userId) {
      const currentUser = await Meteor.users.findOneAsync({ _id: this.userId })
      const oldEmail = currentUser?.emails
      try {
        await Meteor.callAsync('profiles.update', formData._id, formData)
        await setPassword(userId, confirmPass, { logout: false })
        await setUsername(userId, formData.email)
        if (oldEmail) {
          await removeEmail(userId, oldEmail[0].address)
          await addEmail(userId, formData.email)
        }
        return { status: 'success', message: 'Updated user' }
      } catch (e) {
        return { status: 'failed', message: `Error updating user: ${e.message}` }
      }
    } else {
      return { status: 'success', message: 'No user associated with account' }
    }
  },
  async setUserPassword({ id, newPassword }) {
    try {
      await setPassword(id, newPassword)
      return { status: 'success', message: 'Updated password' }
    } catch (e) {
      return { status: 'failed', message: `Error updating user: ${e.message}` }
    }
  },
  async setOwnPassword({ password, oldPassword }, logout = true) {
    const { userId } = this
    if (!userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const user = await Meteor.users.findOneAsync({ _id: userId })
    try {
      if (oldPassword) {
        const verifyResult = await checkPassword(user, oldPassword)
        if (verifyResult?.error) {
          throw new Meteor.Error('An error has occurred')
        }
      }
    } catch (e) {
      throw new Meteor.Error(e.message)
    }

    try {
      await setPassword(userId, password, { logout: logout })
      const refreshedUser = await Meteor.users.findOneAsync({ _id: userId })
      const member = await Profiles.findOneAsync(
        { userId },
        { fields: { name: 1, avatar: 1 } }
      )
      await Meteor.callAsync('sendTrigger', {
        slug: 'password-changed',
        user: refreshedUser,
        member,
      })
    } catch (e) {
      throw new Meteor.Error(e.message)
    }
  },
  async verifyPassword(password) {
    if (this.userId) {
      const user = await Meteor.users.findOneAsync({ _id: this.userId })
      const result = await checkPassword(user, password)
      if (result?.error) {
        throw new Meteor.Error(result.error.reason)
      }
    } else {
      throw new Meteor.Error('No user found')
    }
  },
  async userServices() {
    const user = await Meteor.users.findOneAsync({ _id: this.userId })
    const services = user?.services || {}
    return Object.keys(services)
  },
  async sendResetPasswordEmail(email) {
    if (!Match.test(email, String)) {
      return { status: 'failed', message: 'invalid email' }
    }
    try {
      const user = await findUserByEmail(email)
      if (!user) return { status: 'failed', message: `No user found with email ${email}` }

      if (user && user.services.password) {
        const token = Random.secret()
        const tokenRecord = {
          token,
          email,
          createdAt: new Date(),
          expiryAt: moment().add(1, 'days').toDate(),
        }
        const member =
          (await Profiles.findOneAsync({ userId: user._id }, { fields: { name: 1 } })) ||
          []
        user.name = member.name || 'User'

        await Meteor.users.updateAsync(
          { _id: user._id },
          { $set: { 'services.password.forgotPassToken': tokenRecord } }
        )
        return Meteor.callAsync('sendTrigger', {
          member,
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
  async resetUserPassword(password, userId, token) {
    try {
      // different to the 'setPassword' method as it needs  a token
      const user = await Meteor.users.findOneAsync({ _id: userId })
      const userToken = user?.services?.password?.forgotPassToken

      if (!user || token !== userToken?.token || moment(userToken.expiryAt).isBefore()) {
        throw new Meteor.Error('Email link expired')
      } else {
        await setPassword(userId, password)
        await Meteor.users.updateAsync(
          { _id: userId },
          { $unset: { 'services.password.forgotPassToken': '' } }
        )
        const member = await Profiles.findOneAsync(
          { userId },
          { fields: { name: 1, avatar: 1 } }
        )

        await Meteor.callAsync('sendTrigger', { slug: 'password-changed', user, member })
      }
    } catch (e) {
      throw new Meteor.Error('Your email link may have expired')
    }
  },
  async addNewUser({ email, password, roles, mobile, name, serial }) {
    try {
      const exist = await findUserByEmail(email) // Checks for existing user by email
      if (exist)
        return { status: 'failed', message: 'A user with this email already exists' }
      if (!password) password = 'Password1'
      if (roles.length < 1) roles.push('CUS') // if form does have any roles attached
      const userId = await createUser({ email, username: email, password })
      if (userId) {
        await Roles.addUsersToRoles(userId, roles)
        await Profiles.insertAsync({
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
  async editUserMember({ name, nickname, mobile, sms }) {
    try {
      const userId = this.userId
      const member = await Profiles.findOneAsync({ userId })
      const newMember = {
        userId,
        name,
        nickname,
        mobile,
        notifyBy: sms ? ['EMAIL', 'SMS'] : ['EMAIL'],
      }
      if (member) {
        await Profiles.updateAsync(
          { userId },
          {
            $set: newMember,
          }
        )

        // update the members in events collection
        const memberItem = MemberItemSchema.clean(newMember)
        debug({ memberItem })
        const updateData = {}
        Object.keys(memberItem).map((key) => {
          // TODO: I think Meteor mongo doesn't support $[]
          updateData[`members.$[].${key}`] = memberItem[key]
        })
        debug({ updateData })
        try {
          await Events.updateAsync(
            {
              members: { $elemMatch: { _id: member._id } },
            },
            {
              $set: updateData,
            },
            {
              multi: true,
            }
          )
        } catch (e) {
          debug(e)
          // should we report this error?
        }
      } else {
        if (!newMember.nickname) {
          newMember.nickname = newMember.name.split(' ')[0] || newMember.name
        }
        await Profiles.insertAsync(newMember)
      }
      return { status: 'success', message: 'Added user account' }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }
  },
  async signup({ email, name, mobile }) {
    try {
      const roles = ['CUS']
      const token = Random.secret()
      const tokenRecord = {
        token,
        email,
        createdAt: new Date(),
        expiryAt: moment().add(3, 'days').toDate(),
      }
      const userId = await createUser({
        email,
        username: email,
      })
      if (userId) {
        await Meteor.users.updateAsync(
          { _id: userId },
          { $set: { 'services.email.confirmationToken': tokenRecord } }
        )
        await Roles.addUsersToRoles(userId, roles)
        await Profiles.insertAsync({
          userId,
          name,
          nickname: name.split(' ')[0] || name,
          mobile: mobile,
          notifyBy: ['EMAIL', 'SMS'],
        })
        const user = await Meteor.users.findOneAsync({ _id: userId })
        const member = await Profiles.findOneAsync({ userId })
        const admins = await fetchCursor(Roles.getUsersInRole('ADM'))

        await Meteor.callAsync('sendTrigger', {
          member,
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

  async userExists(email) {
    // if logged in, check if the username is the logged in one and do nothing if it's the same
    if (this.userId) {
      const user = await Meteor.users.findOneAsync({ _id: this.userId })
      if (user?.emails?.[0]?.address === email) {
        return
      }
    }
    const existingUser = await Meteor.users.findOneAsync({ 'emails.0.address': email })
    if (existingUser) {
      throw new Meteor.Error('A user with email ' + email + ' already exists')
    }
  },
  async updateGoogle({ id, google }) {
    try {
      await Meteor.users.updateAsync(
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
  async updateFacebook({ id, facebook }) {
    try {
      await Meteor.users.updateAsync(
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
