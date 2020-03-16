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
  * Enter the test members details
  * Enter fake credit card from the mock api credit card website
  * Click on the register card button
*/

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Retrieve Login webpage', function() {
  it('Retrieve Login webpage', function() {
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

    cy.get('a[href="/edit/YNQQwrCTSsShAMqih"').click()

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

    cy.get('button')
      .contains('Next')
      .should('be.enabled')
      .click()

    cy.get('input[name="email"]')
      .clear()
      .type('test@test.com')

    cy.get('input[name="address_line1"')
      .clear()
      .type('12 Lucky Street')

    cy.get('input[name="address_city"]')
      .clear()
      .type('Middle Park')

    cy.get('input[name="address_state"]')
      .clear()
      .type('VIC')

    cy.get('input[name="address_postcode"]')
      .clear()
      .type('3000')

    cy.get('input[name="address_country"]')
      .clear()
      .type('Australia')

    cy.get('button')
      .contains('Next')
      .should('be.enabled')
      .click()

    cy.get('h2')
      .contains('Payment form - credit card')
      .should('exist')

    cy.get('#mockName')
      .clear()
      .type('Cathrine King')

    cy.get('#mockNumber')
      .clear()
      .type('4200000000000000')

    cy.get('#mockCvc')
      .clear()
      .type('119')

    cy.get('#mockExpiry')
      .clear()
      .type('01/09/2020')

    cy.get('button')
      .contains('Register card')
      .should('exist')
      .should('be.enabled')
      .click()

    cy.get('h2')
      .contains('Card payment receipt')
      .should('exist')
  })
})
