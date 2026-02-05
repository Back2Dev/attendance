/* global Fixtures */
// dummy.data.js
import { Meteor } from 'meteor/meteor'
import things from './fixtures-things.json'
import Members from '/imports/api/members/schema'
import Messages from '/imports/api/messages/schema'
import { Notifications, NotificationItems } from '/imports/api/notifications/schema'
import Jobs from '/imports/api/jobs/schema'
import Events from '/imports/api/events/schema'
const debug = require('debug')('app:fixtures')

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
  // Enable debugging with DEBUG=app:fixtures or DEBUG=app:* when invoking  meteor
  //
  debug: true,
}

const uc1 = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// S T A R T U P  Function to load up dummy data for testing
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Meteor.startup(async function () {
  if (Meteor.settings.env.environment === 'test') {
    console.log('Cleaning up database... ')
    await Meteor.users.removeAsync({})
  }

  Fixtures.loadAssets([
    ...Fixtures.config.things.map((t) => t.name),
    ...Fixtures.config.boot.map((t) => t.name),
  ])

  Fixtures.loadBootThings() // Load (boot-time)  fixtures
  // Fix the members
  // TODO: Add members to fixtures data and remove this
  const users = await Meteor.users.rawCollection().find({}).toArray()
  for (const user of users) {
    const p = await Members.findOneAsync({ userId: user._id })
    if (!p) {
      let name = user.username
      let nickname = user.name?.split(' ')[0] || 'Hey you'
      const matches = user.username?.match(/^(\w+?)\.(\w+?)@/)
      if (matches) {
        nickname = uc1(matches[1])
        name = [uc1(matches[1]), uc1(matches[2])].join(' ')
      }
      await Members.insertAsync({
        name,
        nickname,
        userId: user._id,
        notifyBy: ['EMAIL', 'SMS'],
        status: 'active',
      })
    }
  }
})

Meteor.methods({
  // Fixtures loads things according to the config data above
  // Be aware that you can restrict which environment(s) the data
  // is loaded to using the configs above

  async seedFixtures() {
    Fixtures.loadAssets([
      ...Fixtures.config.things.map((t) => t.name),
      ...Fixtures.config.boot.map((t) => t.name),
    ])
    Fixtures.loadBootThings() // Load (boot-time) fixtures
    // Fix the members
    // TODO: Add members to fixtures data and remove this
    const users = await Meteor.users.rawCollection().find({}).toArray()
    for (const user of users) {
      const p = await Members.findOneAsync({ userId: user._id })
      if (!p) {
        let name = user.name || user.username
        let nickname
        const matches = name?.match(/^(\w+?)\s+(\w+?)@/)
        if (matches) {
          nickname = uc1(matches[1])
          name = [uc1(matches[1]), uc1(matches[2])].join(' ')
        } else {
          nickname = 'Hey you'
        }
        // debug(`Adding member for ${user.username}`)
        await Members.insertAsync({
          name,
          userId: user._id,
          nickname,
          mobile: user.mobile,
          notifyBy: ['EMAIL', 'SMS'],
          status: 'active',
        })
      }
    }
    Fixtures.loadThings() // Loads (non boot-time)  fixtures
  },
  async 'seedFixtures+test'() {
    await Meteor.callAsync('seedFixtures')
  },
  async loadFixtures(thing) {
    // Must check for admin here
    Fixtures.loadThings(thing) // Loads (non boot-time) fixtures
  },
  async resetCollections() {
    // Meteor.users.remove({})
    await Members.removeAsync({})
    await Jobs.removeAsync({})
    await Messages.removeAsync({})
    await Notifications.removeAsync({})
    await NotificationItems.removeAsync({})
    await Events.removeAsync({})
  },
})
