/* global Fixtures */
// dummy.data.js
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import things from './fixtures-things.json'
import Profiles from '/imports/api/members/schema'

const debug = require('debug')('se:fixtures')

// Get the database definition for the target tables
// import Workflows, { Jobs, Steps, Stages } from '/imports/api/workflows/schema'

Fixtures.config = {
  defaultPassword: 'me2', // Default password to use
  // These are loaded at boot time
  boot: [{ table: 'roles', name: 'roles', key: '_id', env: ['all'] }],
  //
  // These are loaded only on request,  from the /restricted page by a meteor method
  //
  things,
  //
  // Enable debugging with DEBUG=se:fixtures or DEBUG=se:* when invoking  meteor
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
  // Fix the profiles
  // TODO: Add profiles to fixtures data and remove this
  Meteor.users.find({}).forEach((user) => {
    const p = Profiles.findOne({ userId: user._id })
    if (!p) {
      let name = user.username
      let nickname = user.name?.split(' ')[0] || 'Hey you'
      const matches = user.username?.match(/^(\w+?)\.(\w+?)@/)
      if (matches) {
        nickname = uc1(matches[1])
        name = [uc1(matches[1]), uc1(matches[2])].join(' ')
      }
      debug(`Adding profile for ${name} (AKA ${nickname})`)
      Profiles.insert({
        name,
        nickname,
        userId: user._id,
        notifyBy: ['EMAIL', 'SMS'],
        status: 'active',
        signature: `signature/default/${user.emails[0].address.toLowerCase()}.png`,
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
    // Fix the profiles
    // TODO: Add profiles to fixtures data and remove this
    Meteor.users.find({}).forEach((user) => {
      const p = Profiles.findOne({ userId: user._id })
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
        Profiles.insert({
          name,
          userId: user._id,
          nickname,
          mobile: user.mobile,
          notifyBy: ['EMAIL', 'SMS'],
          status: 'active',
          signature: `signature/default/${user.emails[0].address.toLowerCase()}.png`,
        })
      }
    })
    Fixtures.loadThings() // Loads (non boot-time)  fixtures
  },
  'seedFixtures+test'() {
    Meteor.call('seed.members')
    // Meteor.call('seedFixtures')
    // Meteor.call('loadFixtures', 'workflows-test')
  },
  loadFixtures(thing) {
    // Must check for admin here
    Fixtures.loadThings(thing) // Loads (non boot-time) fixtures
  },
  resetCollections() {
    const names = 'members'.split(/\s+/)
    debug(`resetCollections, emptying: ${names.join(', ')}`)
    const query = { se: { $exists: false } }
    const userIds = Meteor.users.find(query).map((user) => user._id)
    Meteor.users.remove(query)
    Profiles.remove({ userId: { $in: userIds } })
    names.forEach((collection) => {
      try {
        Mongo.Collection.get(collection).remove({})
      } catch (e) {
        debug(`Something wrong emptying ${collection}: ${e.message}`)
      }
    })
  },
})
