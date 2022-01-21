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
  const name = faker.name.findName()
  const [nickname] = name.split(' ')
  const email = faker.internet.email()

  beforeEach(function () {
    loadCypressFixtures()
    cy.visit('/login')

    // dont use UI to log in
    // https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-In
  })

  it('successfully signs up an account with an email on the sign up page', function () {
    cy.get('#sign-up-link').should('exist').click()
    cy.get('input[name="name"]').should('exist').type(name)
    cy.get('input[name="email"]').should('exist').type(email)
    cy.get('#submit-button').click()
    cy.get('h2').contains(`Welcome ${nickname}`).should('exist')
  })
})
