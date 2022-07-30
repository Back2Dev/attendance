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
import './commands'

// import faker from 'faker'
// import moment from 'moment'

// function generate(times, cb) {
//   let result = []
//   for (let i = 0; i < times; i++) {
//     result.push(cb())
//   }
//   return result
// }

global.login = (username, password) => {
  cy.window().then((win) => {
    if (!win.Meteor) alert('Meteor not found - wrong url?')
    win.Meteor.loginWithPassword(username, password)
  })
}

global.adminLogin = (username, password) => {
  cy.window().then((win) => {
    win.Meteor.loginWithPassword(username, password)
    win.localStorage.setItem('viewas', 'ADM')
  })
}

global.loginToNextStep = (username, password, address) => {
  cy.visit('/bookings').wait(1000)
  cy.window().then((win) => {
    win.Meteor.loginWithPassword(username, password, address)
  })
  cy.get('.address > a').should('contain', address).click()
}

global.logout = () => {
  cy.window().then((win) => {
    win.Meteor.logout()
  })
}

global.loadCypressFixtures = () => {
  cy.fixture('users.json').as('users')
  console.log('Loaded fixtures')
}

global.resetCollections = () => {
  cy.window().then(async (win) => {
    await win.Meteor.callAsync('resetCollections')
  })
}

global.seedDatabase = () => {
  cy.window().then(async (win) => {
    await win.Meteor.callAsync('seedFixtures+test')
  })
}

global.clearSessionStorage = () => {
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
}

global.freshDatabase = () => {
  cy.visit('/')
  resetCollections()
  cy.wait(2000) // Give it a moment to recover from having the db nuked underneath the app
  loadCypressFixtures()
  // resetDatabase()
  // cy.wait(3000) // Give it a moment to recover from having the db nuked underneath the app
  seedDatabase()
  // cy.wait(4000) // Give it a moment to recover from having the db nuked underneath the app
  clearSessionStorage()
}
