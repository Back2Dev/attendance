// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'
import faker from 'faker'

function generate(times, cb) {
  const result = []
  for (let i = 0; i < times; i++) {
    result.push(cb())
  }
  return result
}

global.login = (username, password) => {
  cy.window().then(win => {
    win.Meteor.loginWithPassword(username, password)
  })
}

global.school = () => {
  faker.seed(123)
  return {
    _id: faker.random.number(),
    name: `${faker.address.city()  } School`,
    slug: faker.lorem.word(),
    schoolYear: '2018',
    termNo: 3,
    terms: 4,
    years: {},
    email: 'demo@tmap.me',
    password: 'password',
  }
}

global.classy = () => {
  faker.seed(123)
  const letter = 'A'
  const grade = faker.random.number(12)
  const teacherName = [faker.name.firstName(), faker.name.lastName()]
  return {
    _id: faker.random.number(),
    name: `${grade}${letter} Miss ${teacherName[1]}`,
    slug: `dem${grade}${letter}`,
    password: 'demo',
    schoolYear: '2018',
    termNo: 1,
    terms: [],
    schoolId: faker.random.number(),
    grade,
    letter,
    teacherName: teacherName.join(' '),
    teacherEmail: 'dem7d@tmap.me',
  }
}

// for use when bulk adding a class
global.fakeClassList = () => {
  const n = generate(20, faker.name.findName)
  return n.join('\n')
}

global.loadFixtures = () => {
  // cy.fixture('users.json').as('users')
  // cy.window().then(win => win.Meteor.call('loadFixtures'))
}

global.rmPin = name => {
  cy.window().then(win => win.Meteor.call('members.rmPin', name))
}

global.rmEddie = name => {
  cy.window().then(win => win.Meteor.call('members.rmEddie', name))
}
