import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
// import { Random } from 'meteor/random'
import { Factory } from 'meteor/dburles:factory'
import faker from 'faker'

// import CONSTANTS from '/imports/api/constants'
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
  roles: [],
}).after(createMember)

Factory.define(
  'UserAGT',
  Meteor.users,
  Factory.extend('user', {
    roles: [
      {
        _id: 'AGT',
        scope: null,
        assigned: true,
      },
    ],
  })
).after(createMember)

Factory.define(
  'UserADM',
  Meteor.users,
  Factory.extend('user', {
    roles: [
      {
        _id: 'ADM',
        scope: null,
        assigned: true,
      },
    ],
  })
).after(createMember)

Factory.define(
  'UserBRK',
  Meteor.users,
  Factory.extend('user', {
    roles: [
      {
        _id: 'BRK',
        scope: null,
        assigned: true,
      },
    ],
  })
).after(createMember)

Factory.define(
  'UserCON',
  Meteor.users,
  Factory.extend('user', {
    roles: [
      {
        _id: 'CON',
        scope: null,
        assigned: true,
      },
    ],
  })
).after(createMember)

Factory.define(
  'UserPM',
  Meteor.users,
  Factory.extend('user', {
    roles: [
      {
        _id: 'PM',
        scope: null,
        assigned: true,
      },
    ],
  })
).after(createMember)

Factory.define(
  'UserCUS',
  Meteor.users,
  Factory.extend('user', {
    roles: [
      {
        _id: 'CUS',
        scope: null,
        assigned: true,
      },
    ],
  })
).after(createMember)

Factory.define(
  'UserRAD',
  Meteor.users,
  Factory.extend('user', {
    roles: [
      {
        _id: 'RAD',
        scope: null,
        assigned: true,
      },
    ],
  })
).after(createMember)

export const createTeam = (roles) => {
  const connie = Factory.create('user', { name: 'Connie Vey' })
  const bert = Factory.create('user', { name: 'Bert Buyer' })
  const betty = Factory.create('user', { name: 'Betty Buyer' })
  const pm = Factory.create('user', { name: 'Prima Donna' })
  const orange = Factory.create('user', { name: 'Agent Orange' })
  const people = [
    {
      name: connie.name,
      role: 'CON',
      methods: ['email', 'sms'],
      userId: connie._id,
      role: 'CON',
      email: 'connie@test.test',
      mobile: '911connie',
    },
    {
      name: bert.name,
      role: 'CUS',
      methods: ['email', 'sms'],
      userId: bert._id,
      role: 'CUS',
      email: 'bert@test.test',
      mobile: '911bert',
    },
    {
      name: betty.name,
      role: 'CUS',
      methods: ['email', 'sms'],
      userId: betty._id,
      role: 'CUS',
      email: 'betty@test.test',
      mobile: '911betty',
      primary: true,
    },
    {
      name: pm.name,
      role: 'PM',
      methods: ['email', 'sms'],
      userId: pm._id,
      role: 'PM',
      email: 'pm@test.test',
      mobile: '911pm',
    },
    {
      name: orange.name,
      role: 'AGT',
      methods: ['api'],
      userId: orange._id,
      role: 'AGT',
      email: 'orange@test.test',
      mobile: '911orange',
    },
  ]
  // Are we filtering the roles returned?
  if (!roles) return people
  if (Array.isArray(roles)) return people.filter((p) => roles.includes(p.role))
  else {
    const numbers = Object.assign({}, roles)
    return people.reduce((prev, p) => {
      if (p.role && numbers[p.role]) {
        numbers[p.role] = numbers[p.role] - 1
        prev.push(p)
      }
      return prev
    }, [])
  }
}
