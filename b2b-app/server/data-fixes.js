import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { DateTime } from 'luxon'
// import Profiles from '/imports/api/profiles/schema'
import { accessByPath } from '/imports/api/util'
const debug = require('debug')('app:data-fixes')

const fallbackRoles = [
  {
    username: 'mike.king@mapconsulting.com',
    roles: ['ADM', 'WSADM'],
  },
  {
    username: 'george@beatles.com',
    roles: ['PART'],
  },
  {
    username: 'john@beatles.com',
    roles: ['PART'],
  },
  {
    username: 'paul@beatles.com',
    roles: ['PART'],
  },
  {
    username: 'ringo@beatles.com',
    roles: ['PART'],
  },
  {
    username: 'brian@acme.com',
    roles: ['BOSS'],
  },
  {
    username: 'super.mario@mario.com',
    roles: ['ADM', 'WSADM'],
  },
]

Meteor.methods({
  // This may be necessary after loading fixtures

  async roleFix() {
    const coreUsers = await Meteor.users
      .find({ core: true, roles: { $exists: true } })
      .fetchAsync()
    if (coreUsers.length) {
      for (const u of coreUsers) {
        for (const role of u.roles) {
          await Roles.createRoleAsync(role, { unlessExists: true })
        }
        await Roles.setUserRolesAsync(u._id, u.roles)
      }
    } else {
      for (const u of fallbackRoles) {
        for (const role of u.roles) {
          await Roles.createRoleAsync(role, { unlessExists: true })
        }
        const user = await Meteor.users.findOneAsync({ username: u.username })
        if (user) await Roles.setUserRolesAsync(user._id, u.roles)
      }
    }
  },
})
