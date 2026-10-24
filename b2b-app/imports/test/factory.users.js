/* global Roles */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
// import { Random } from 'meteor/random'
import { Factory } from 'meteor/dburles:factory'
import faker from 'faker'

import CONSTANTS from '/imports/api/constants'
import Profiles from '/imports/api/profiles/schema.js'

const createMember = async (doc) => {
  // create user member
  await Profiles.insertAsync({
    userId: doc._id,
    name: faker.name.findName(),
    mobile: faker.phone.phoneNumber(),
    nickname: faker.name.firstName(),
  })
  // set password
  await Accounts.setPasswordAsync(doc._id, doc.password)
}

Factory.define('user', Meteor.users, {
  username: () => faker.internet.userName(),
  password: () => faker.internet.password(),
  emails: () => {
    return [
      {
        address: faker.internet.email(),
        verified: false,
      },
    ]
  },
}).after(createMember)

// this doesn't work
Object.keys(CONSTANTS.ROLES).map((role) => {
  Factory.define(`User${role}`, Meteor.users, Factory.extend('user', {})).after(async (doc) => {
    // try to create role
    await Roles.createRoleAsync(role, { unlessExists: true })
    await Roles.setUserRolesAsync(doc._id, role)
    await createMember(doc)
  })
})
