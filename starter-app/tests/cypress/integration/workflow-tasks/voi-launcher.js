import users from '/tests/cypress/fixtures/users.json'
import listings from '/tests/cypress/fixtures/listings'
const address = listings.easy.address

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are    using
  return false
})

describe('Buyers questionnaire web form (mini-workflow)', () => {
  before(function () {
    freshDatabase()
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('cleanup.listing', listings.easy.address)
    })
    cy.wait(4000)
  })
  it('Adds a property and completes the VOI', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.customer.username, users.customer.password)
    cy.window().then(async (win) => {
      listings.easy.slug = 'test-voi'
      const response = await win.Meteor.callAsync('launch.job', listings.easy)
      console.log(response)
    })
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    // cy.get('.current > button').then((element) => {
    //   cy.wrap(element).invoke('text').should('contain', "Complete buyer's questionnaire")
    //   cy.wrap(element).click()
    // })
    cy.get('button#voi').should('exist').click()
  })

  it('Completes the "Finished" task', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.customer.username, users.customer.password)
    cy.wait(400)
    cy.get('h1').contains('My properties').should('exist')
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    // cy.get('.current > button').then((element) => {
    //   cy.wrap(element).invoke('text').should('contain', 'Finished')
    //   cy.wrap(element).click()
    // })
    cy.get('button#fini').should('exist').click()
    cy.get('button#checklist').should('exist').click()
    cy.get('h1').contains('Finished').should('exist')
    cy.get('input#done').should('exist').click()
    cy.get('button#complete').should('exist').click()
    // Wait for confirmation of the step being completed
    cy.get('div.MuiCardHeader-root').contains('Finished').should('exist')
  })
})
