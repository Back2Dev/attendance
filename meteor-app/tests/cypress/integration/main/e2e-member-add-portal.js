/* Pseudo code for member portal test
  * navigate to the kisok/volsignin page
  
  * go to the /add page
  * sign a user up with their email and password
  * click the submit button
  * check for the name and details of the user
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

describe('Portal login', function() {
  it('uses members login and views the member portal', function() {
    cy.visit('/login')

    cy.get('input[name="email"]')
      .clear()
      .type('test@test.com')

    cy.get('input[name="password"]')
      .clear()
      .type('1234')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

    cy.get('h1')
      .contains('Peak Adventure')
      .should('exist')

    cy.get('div')
      .contains('Cathrine King')
      .should('exist')

    cy.get('.card-avatar-img').should('exist')

    cy.get('div')
      .contains('Last seen' + ' ' + '4 hours ago')
      .should('exist')

    cy.get('div')
      .contains('Email' + ' ' + 'test@test.com')
      .should('exist')

    cy.get('div')
      .contains('Mobile' + ' ' + '0400 911 911')
      .should('exist')

    cy.get('div')
      .contains('Expires' + ' ' + 'N/A')
      .should('exist')

    cy.get('button')
      .contains('Register your credit card')
      .should('exist')
  })
})
