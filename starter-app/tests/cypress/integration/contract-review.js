import users from '/tests/cypress/fixtures/users.json'
import 'cypress-file-upload'
const signedcontract = '../fixtures/contract-review.pdf'
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
const address = 'Testing Grounds, City Road, Southbank VIC, Australia'

describe('adds a property from the landing page (new user)', () => {
  before(function () {
    freshDatabase()
  })

  it('goes to the properteis and uploads signed contract of sale', () => {
    cy.visit('/dashboard')
    login(users.customer.username, users.customer.password)
    cy.get('[data-cy=welcome]').should('exist')
    cy.get('[data-cy=add-btn]').click()
    cy.get('[data-cy="add-property"]').should('exist')
    cy.get('#google-places-search').clear().type(address)
    cy.get('[value="contract-review"]').click()
    cy.get('[data-cy=addproperty-submit]').should('be.enabled').click()
  })
  it('navigates and works thorough the dispatcher', () => {
    cy.visit('/dashboard')
    login(users.pm.username, users.pm.password)
    cy.get('[data-cy=welcome]').should('exist')
    cy.get('#properties-nav-item > .makeStyles-linkText-8').should('exist').click()
    cy.get('h1').contains('My properties').should('exist')
    cy.get('.address').should('exist').click()
    cy.get('[data-cy=dispatch-next]').click()
    cy.get('#settlement-date-picker').clear().type('04092021')
    cy.get('[name="referralSource"]').clear().type('Barry Plant')
    cy.get('#cost-adorment-cost').clear().type('660')
    cy.get('[data-cy=dispatch-next]').click()
    cy.get('#role-select').should('exist').type('CON')
    cy.get('#role-select-option-0').should('exist').click()
    cy.get('#user-select').clear().type('Constantine Veya')
    cy.get('#user-select-option-0').should('exist').click()
    cy.get('[data-cy=add-person-submit]').should('exist').click()
    cy.get('[data-cy=dispatch-next]').click()
    cy.get('[data-cy=dispatch-next]').click()
    cy.get('[data-cy=launch-job]').click()

    cy.get('#skip-upload-existing-review').click()
    cy.get('#yes-skip').click()
  })
})
