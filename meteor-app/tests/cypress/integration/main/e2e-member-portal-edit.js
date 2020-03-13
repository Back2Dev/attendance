/* Pseudo code for testing member portal buttons
  * Navigate to /login
  * Enter login details
  * Click on the member portal page
  * Enter members details

  * Open up test members portal
  * Click on the edit profile button
  * Determine whether it retrieves the edit profile webpage
  * 
  * Click on the register your credit card button
  * 
  * Check for error message
*/

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Retrieve kiosk webpage', function() {
  it('Retrieve kiosk webpage', function() {
    cy.visit('login')

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

    cy.get('div')
      .contains('Cathrine King')
      .should('exist')

    cy.get('button')
      .contains('Edit your profile')
      .should('be.enabled')
      .click()

    cy.get('h1')
      .contains('Edit your details')
      .should('exist')

    cy.get('a[href="/member-portal"').click()

    cy.get('h1')
      .contains('Peak Adventure')
      .should('exist')

    cy.get('div')
      .contains('Cathrine King')
      .should('exist')

    cy.get('button')
      .contains('Register your credit card')
      .should('be.enabled')
      .click()

    cy.get('h2')
      .contains('Credit Card Registration')
      .should('exist')
  })
})
