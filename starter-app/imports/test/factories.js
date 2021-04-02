/**
 * test factories.
 * configure our factories here and return the Factory module.
 */
import { Meteor } from 'meteor/meteor'
import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import _ from 'lodash'
import CONSTANTS from '/imports/api/constants'
import './generated-factories'

// publications

// Factory.define('user', Meteor.users, {
//   emails: [
//     {
//       address: () => faker.internet.email(null, null, 'tmap.me'),
//       verified: true,
//     },
//   ],
// })

export const createSuperAdmin = () => {
  return Factory.create('user', {
    roles: ['ADM'],
    superadmin: true,
  })
  // return Factory.create('user', {
  //   role: 'admin',
  //   superadmin: true,
  // })
}

export const createAdmin = () => {
  return Factory.create('user', {
    roles: ['ADM'],
  })
}

export default Factory
