/* global Fixtures */
// dummy.data.js
import { Meteor } from 'meteor/meteor'
import things from './fixtures-things.json'
import Members from '/imports/api/members/schema'
import Messages from '/imports/api/messages/schema'
import { Notifications, NotificationItems } from '/imports/api/notifications/schema'

const debug = require('debug')('b2b:fixtures')

// Get the database definition for the target tables

Fixtures.config = {
  defaultPassword: 'me2', // Default password to use
  // These are loaded at boot time
  boot: [{ table: 'roles', name: 'roles', key: '_id', env: ['all'] }],
  //
  // These are loaded only on request,  from the /restricted page by a meteor method
  //
  things,
  //
  // Enable debugging with DEBUG=b2b:fixtures or DEBUG=b2b:* when invoking  meteor
  //
  debug: false,
}

const uc1 = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// S T A R T U P  Function to load up dummy data for testing
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Meteor.startup(function () {
  if (Meteor.settings.env.environment === 'test') {
    console.log('Cleaning up database... ')
    Meteor.users.remove({})
  }

  Fixtures.loadAssets([
    ...Fixtures.config.things.map((t) => t.name),
    ...Fixtures.config.boot.map((t) => t.name),
  ])

  Fixtures.loadBootThings() // Load (boot-time)  fixtures
  // Fix the members
  // TODO: Add members to fixtures data and remove this
  Meteor.users.find({}).forEach((user) => {
    const p = Members.findOne({ userId: user._id })
    if (!p) {
      let name = user.username
      let nickname = user.name.split(' ')[0] || 'Hey you'
      const matches = user.username?.match(/^(\w+?)\.(\w+?)@/)
      if (matches) {
        nickname = uc1(matches[1])
        name = [uc1(matches[1]), uc1(matches[2])].join(' ')
      }
      // debug(`Adding profile for ${name} (AKA ${nickname})`)
      Members.insert({
        name,
        nickname,
        userId: user._id,
        notifyBy: ['EMAIL', 'SMS'],
        status: 'active',
      })
    }
  })
})

Meteor.methods({
  // Fixtures loads things according to the config data above
  // Be aware that you can restrict which environment(s) the data
  // is loaded to using the configs above

  seedFixtures() {
    Fixtures.loadAssets([
      ...Fixtures.config.things.map((t) => t.name),
      ...Fixtures.config.boot.map((t) => t.name),
    ])
    Fixtures.loadBootThings() // Load (boot-time) fixtures
    // Fix the members
    // TODO: Add members to fixtures data and remove this
    Meteor.users.find({}).forEach((user) => {
      const p = Members.findOne({ userId: user._id })
      if (!p) {
        let name = user.name
        let nickname
        const matches = name?.match(/^(\w+?)\s+(\w+?)@/)
        if (matches) {
          nickname = uc1(matches[1])
          name = [uc1(matches[1]), uc1(matches[2])].join(' ')
        } else {
          nickname = 'Hey you'
        }
        // debug(`Adding profile for ${user.username}`)
        Members.insert({
          name,
          userId: user._id,
          nickname,
          mobile: user.mobile,
          notifyBy: ['EMAIL', 'SMS'],
          status: 'active',
        })
      }
    })
    Fixtures.loadThings() // Loads (non boot-time)  fixtures
  },
  'seedFixtures+test'() {
    Meteor.call('seedFixtures')
  },
  loadFixtures(thing) {
    // Must check for admin here
    Fixtures.loadThings(thing) // Loads (non boot-time) fixtures
  },
  resetCollections() {
    // Meteor.users.remove({})
    // Members.remove({})
    Messages.remove({})
    Notifications.remove({})
    NotificationItems.remove({})
  },
})
