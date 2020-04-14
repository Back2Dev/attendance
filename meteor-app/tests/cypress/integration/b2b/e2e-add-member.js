/*
  * go to /add to add a member
  * enter details for the  new member
  * Add a password to access the member portal
  * login with the member details
  * check for the name and details of the member
  * check for the number of passes
  * check for the credit card button
  * click the update button
  
  */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Adds Member to portal', function() {
  it('creates a volunteer and adds them to the member portal', function() {
    cy.visit('/login')
    cy.get('input[name="email"]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name="password"]')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()
  })
})
