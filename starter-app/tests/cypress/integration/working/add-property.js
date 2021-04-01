import users from '/tests/cypress/fixtures/users.json'
import 'cypress-file-upload'

const address = '21 Buy new, Westside VIC, Australia'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('adds a property from the landing page (new user)', () => {
  before(function () {
    freshDatabase()
  })
  it('successfully adds a property from the landing page', () => {
    // Enters a new property
    cy.get('#add-property-nav-item').should('exist').click()
    cy.get('[type="radio"]').should('exist').first().check()
    cy.get('#google-places-search').should('exist').clear().type(address).blur()
    cy.get('#next-button').should('exist').click()

    // Signs up a new account
    cy.get('[data-cy="signup"]').should('exist')
    cy.get('form').should('exist')
    cy.get('input[name="name"]').clear().type(users.newCustomer.name)
    cy.get('input[name="email"]').clear().type(users.newCustomer.username)
    cy.get('input[type="tel"]').clear().type(users.newCustomer.phone)
    cy.get('#next-button').should('exist').click()

    cy.get('#review').should('exist')
    cy.get('[data-cy=contained-button-file]').should('exist').attachFile('contract.pdf')
    cy.get('#next-button').should('exist').click()
    cy.get('[data-cy="confirmation"]').should('exist')
  })
  it('checks if the property exists in the PM property page', () => {
    cy.visit('/properties')
    cy.get('[data-cy="login"]').should('exist')
    login(users.pm.username, users.pm.password)
    cy.get('a[href="/properties"]').should('exist')
    cy.get('.address >.MuiTypography-root').should('contain', address)
  })
})
