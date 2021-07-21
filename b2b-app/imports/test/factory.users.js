/* global Roles */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
// import { Random } from 'meteor/random'
import { Factory } from 'meteor/dburles:factory'
import faker from 'faker'

import CONSTANTS from '/imports/api/constants'
import Members from '/imports/api/members/schema.js'

const createMember = (doc) => {
  // create user member
  Members.insert({
    userId: doc._id,
    name: faker.name.findName(),
    mobile: faker.phone.phoneNumber(),
    nickname: faker.name.firstName(),
  })
  // set password
  Accounts.setPassword(doc._id, doc.password)
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
  Factory.define(`User${role}`, Meteor.users, Factory.extend('user', {})).after((doc) => {
    // try to create role
    Roles.createRole(role, { unlessExists: true })
    Roles.setUserRoles(doc._id, role)
    createMember(doc)
  })
})
