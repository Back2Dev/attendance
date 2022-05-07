import { check } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { ServiceConfiguration } from 'meteor/service-configuration'
 
import log from '/imports/lib/log'

import Profiles from '/imports/api/profiles/schema.js'

/**
 * Lowercase and trim user email(s)
 * @param  {Object} options   options map passed to Accounts.createUser()
 * @param  {Object} user      'proposed' User object to create
 * @return {Object}           User object to create
 */

Accounts.onCreateUser((options, user) => {
  const profile = {
    userId: user._id,
    profile_id: 1,
    user_id: 1,
    notifyBy: ['EMAIL', 'SMS'],
  }
  const { google, facebook, twitter } = user.services
  if (google) {
    const { email, name, picture } = google
    const existingUser = Accounts.findUserByEmail(email)
    if (existingUser) {
      throw new Meteor.Error(409, 'Account already exists', {
        google: google,
        id: existingUser._id,
      })
    } else {
      user.emails = [{ address: email, scope: null, assigned: true }]
      user.username = email

      profile.name = name
      profile.avatar = picture
      Roles.setUserRoles(user, ['MEM'])
    }
  }
  if (facebook) {
    const { email, name, picture } = facebook

    const existingUser = Accounts.findUserByEmail(email)
    if (existingUser) {
      throw new Meteor.Error(409, 'Account already exists', {
        facebook: facebook,
        id: existingUser._id,
      })
    } else {
      user.emails = [{ address: email, scope: null, assigned: true }]
      user.username = email

      profile.name = name
      profile.avatar = picture.data.url
      Roles.setUserRoles(user, ['MEM'])
    }
  }

  // this user should not have profile record at this moment, but let do a double check
  const existingProfile = Profiles.findOne({ userId: profile.userId })
  if (!existingProfile && profile.name) {
    // calculate the nickname
    profile.nickname = profile.name.split(' ')[0] || profile.name

    Meteor.call('insert.profiles', profile, (err) => {
      console.log(err)
    })
  }

  const admins = Roles.getUsersInRole('ADM').fetch()

  // TODO: Find a neater way of preventing emails going out when fixtures are inserted
  if (Meteor.settings.env.enironment === 'prod')
    Meteor.call('sendTrigger', {
      profile,
      user,
      slug: 'new-user',
      people: admins,
    })

  return user
})
const googleService = ServiceConfiguration.configurations.findOne({ service: 'google' })
if (!googleService) {
  ServiceConfiguration.configurations.upsert(
    { service: 'google' },
    {
      $set: {
        loginStyle: 'popup',
        clientId:
          '539249286175-irmtj1ufg0adm1eqpbdqon46gdtfeq3s.apps.googleusercontent.com',
        secret: Meteor.settings.private.GOOGLE_SECRET,
      },
    }
  )
}
const facebookService = ServiceConfiguration.configurations.findOne({
  service: 'facebook',
})
if (!facebookService) {
  ServiceConfiguration.configurations.upsert(
    { service: 'facebook' },
    {
      $set: {
        loginStyle: 'popup',
        appId: Meteor.settings.private.FACEBOOK_APPID,
        secret: Meteor.settings.private.FACEBOOK_SECRET,
      },
    }
  )
}
const twitterService = ServiceConfiguration.configurations.findOne({
  service: 'twitter',
})
if (!twitterService) {
  ServiceConfiguration.configurations.upsert(
    { service: 'twitter' },
    {
      $set: {
        loginStyle: 'popup',
        consumerKey: 'the-app-id',
        secret: 'the-secret-string',
      },
    }
  )
}

Accounts.onLogin(function updateLastLoggedIn() {
  // this fires whenever a user loads a page cold because it includes
  // 'resume' logins. you can introspect the argument to differentiate
  // 'hard' logins but for this purpose it's probably useful to update
  // each time.
  // return Meteor.call('profileTouchLastLoggedIn')
})

Accounts.urls.resetPassword = function (token) {
  return Meteor.absoluteUrl('reset-password/' + token)
}

// Accounts.emailTemplates.resetPassword.from = () => {
//   // Overrides the value set in `Accounts.emailTemplates.from` when resetting passwords.
//   return 'Startup Inc <noreply@mydomain.com.au>'
// }

Accounts.onLoginFailure(function (arg) {
  const data = {
    type: arg.type,
    error: arg.error.message,
    oauthCredentialToken:
      arg.type === 'oauth' ? arg.methodArguments[0].oauth.credentialToken : '',
    email:
      arg.type === 'password' && arg.methodArguments[0].user
        ? arg.methodArguments[0].user.email
        : '',
    clientAddress: arg.connection.clientAddress,
  }
  data['user-agent'] = arg.connection.httpHeaders['user-agent']
  log.info('bad login', data)
})

Meteor.methods({
  tmForgotPassword: function (email) {
    check(email, String)
    // First try and find the user by email
    const user = Accounts.findUserByEmail(email)
    if (user) {
      return true
    } else {
      return false
    }
  },
})
