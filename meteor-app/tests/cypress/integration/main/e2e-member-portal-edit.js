/* Pseudo code for testing member portal buttons
  * Navigate to /login
  * enter  login details
  * click on the member portal page
  * enter members details

  * open up test members portal
  * click on the edit profile button
  * Determine whether it retrieves the edit profile webpage
  * 
  * find a test member
  * Enter a WWCC which is expired
  * Check for error message
*/

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

    cy.get('div').contains('Cathrine King')

    cy.get('button')
      .contains('Edit your profile')
      .should('be.enabled')
      .click()

    cy.get('h1').contains('Enter your details')

    cy.get('a[href="/member-portal"').click()
  })
})
