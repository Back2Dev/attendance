import { existingCustomer } from '/tests/cypress/fixtures/users.json'
const faker = require('faker')

Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('Sign up functions from landing page', () => {
  before(function () {
    freshDatabase()
    cy.visit('/login')
  })

  it('Successfully sends forgot password email', function () {
    cy.get('[data-cy=forgot-password]').should('exist').click()
    cy.get('input[name="email"]').should('exist').type(existingCustomer.username)
    cy.get('#submit-button').click()
  })
})
