import { pm, existingCustomer } from '/tests/cypress/fixtures/users.json'
Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

const address = 'Testing Grounds, City Road, Southbank VIC, Australia'

describe('Goes through PM Dispatch Workflow', () => {
  before(function () {
    freshDatabase()
  })

  it('successfully adds a new property as a customer', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(existingCustomer.username)
    cy.get('[data-cy=password-input]').type(existingCustomer.password)
    cy.get('[data-cy=login-btn]').wait(200).click()
    cy.get('[data-cy=add-btn]').should('exist').click()
    cy.get('#google-places-search').type(address).blur()
    cy.get('#uniforms-0000-0002 > :nth-child(1)').click()
    cy.get('#uniforms-0000-0004 > :nth-child(2)').should('exist').click()
    cy.get('[data-cy=addproperty-submit]').click()
    logout()
  })

  it('PM successfully goes through the PM dispatch workflow', function () {
    cy.PMDispatcher(pm.username, pm.password, address)
  })
})
