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
import team from './test-data'
const adminPassword = 'me2'
const adminUser = 'admin@back2bikes.com.au'

const fakeUserData = {
  name: () => faker.name.findName(),
  email: () => faker.internet.email(),
  // TODO - the rest of these
  isHere: true,
  avatar: '7.jpg',
  sessions: [],
  // lastIn: new Date(),
  // joined: new Date(),
  addressPostcode: '3428',
  addressState: 'VIC',
  addressStreet: '199 Henderson Spur',
  addressSuburb: 'South Melbourne',
  bikesHousehold: 5,
  email: 'Jelly.Belly@smells.nasty.com',
  emergencyContact: 'Everett Mosciski',
  emergencyEmail: 'Ibrahim.Flatley@gmail.com',
  emergencyMobile: '848-220-5422',
  emergencyPhone: '848-924-0182',
  mobile: '352-485-4816',
  name: 'Orie Kautzer',
  phone: '144-467-2060',
  workStatus: 'Student',
  reasons: `My love of bikes started as a child. It was my transport growing up,
      I had no money to pay for repairs, so I had to fix it myself. My best bike
      was a white Sun 10 speed racer. I saved up for months to buy it. I saved
      money from my paper round, and my dad threw some money in too.
    `,
  primaryBike: 'Racer'
}

function generate(times, cb) {
  const result = []
  for (let i = 0; i < times; i++) {
    result.push(cb())
  }
  return result
}

global.team = team // Make the team data available to the team

global.login = (username, password) => {
  cy.window().then(win => {
    win.Meteor.loginWithPassword(username, password)
  })
}
global.loginAsAdmin = () => {
  cy.window().then(win => {
    win.Meteor.loginWithPassword(adminUser, adminPassword)
  })
}

global.loadFixtures = () => {
  // cy.fixture('users.json').as('users')
  // cy.window().then(win => win.Meteor.call('loadFixtures'))
}

global.rmPin = name => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.rmPin', name)
  })
}

global.addCard = (name, cardToken) => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.addCard', name, cardToken)
  })
}

global.mkFakeUser = username => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.mkFakeUser', username, fakeUserData)
  })
}

global.rmEddie = name => {
  console.log('removing eddie')
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.rmEddie', username, fakeUserData)
  })
}

global.rmToughGuy = () => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.rmToughGuy')
  })
}

global.rmJackieChan = () => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.rmJackieChan')
  })
}

global.rmBruceLee = () => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.rmBruceLee')
  })
}

global.rmCathrineKing = () => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.rmCathrineKing')
  })
}

global.rmRookiePaddler = () => {
  cy.window().then(win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else win.Meteor.call('members.rmRookiePaddler')
  })
}

//
// Common test data, stored here so we don't repeat ourselves
//
global.ratPack = [
  { name: 'Tough Guy', memberType: ['Multi pass', 'PA Casual session'] },
  { name: 'Bruce Lee', memberType: ['Memberships', 'PA 12 month membership'] },
  { name: 'Jackie Chan', memberType: ['Multi pass', 'PA Casual signup'], change: 'PA Casual session' }
]

global.addJackie = () => {
  cy.window().then(async win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else {
      await win.Meteor.callAsync('members.rmJackieChan')
      await win.Meteor.callAsync('members.addDude', team.jackie)
    }
  })
}

global.addBruce = () => {
  cy.window().then(async win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else {
      await win.Meteor.callAsync('members.rmBruceLee')
      await win.Meteor.callAsync('members.addDude', team.bruce)
    }
  })
}

global.addTough = () => {
  cy.window().then(async win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else {
      await win.Meteor.callAsync('members.rmToughGuy')
      await win.Meteor.callAsync('members.addDude', team.tough)
    }
  })
}

global.addEddie = () => {
  cy.window().then(async win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else {
      await win.Meteor.callAsync('members.rmEddie')
      await win.Meteor.callAsync('members.addDude', team.eddie)
    }
  })
}

global.addCathrine = () => {
  cy.window().then(async win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else {
      await win.Meteor.callAsync('members.rmCathrineKing')
      await win.Meteor.callAsync('members.addDude', team.cathrine)
    }
  })
}

global.addRookie = () => {
  cy.window().then(async win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else {
      await win.Meteor.callAsync('members.rmRookiePaddler')
      await win.Meteor.callAsync('members.addDude', team.rookie)
    }
  })
}

global.rmSessions = id => {
  console.log('rmSessions', id)
  cy.window().then(async win => {
    if (!win.Meteor) alert('Meteor is not defined, did you forget to load the meteor page first?')
    else {
      await win.Meteor.callAsync('members.rmSessions', id)
    }
  })
}

global.shortName = function(name) {
  const names = name ? name.split(' ') : ['Unknown']
  return names[1] ? `${names[0]} ${names[1][0]}` : `${names[0]}`
}
