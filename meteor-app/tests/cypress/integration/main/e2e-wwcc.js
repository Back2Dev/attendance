/* Pseudo code for Working with Children Check (WWCC)
  * Navigate to /admin/wwcc
  * Find a test member
  * Enter a valid WWCC, and Enter a invalid surname
  * Check if error message is displayed, with info about wrong surname

  * Find a test member
  * Enter a invalid WWCC
  * Check for error message
  * 
  * find a test member
  * Enter a WWCC which is expired
  * Check for error message
*/

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('Retrieve kiosk webpage', function() {
  it('Retrieves the kiosk webpage ', function() {
    cy.visit('/admin/login/')
    loginAsAdmin()

    cy.get('div[data-page="wwcc"]')
      .should('exist')
      .click()

    // Adds a wwcc number that fails - name mismatch
    cy.get('button[about="Cathrine King-add"]')
      .contains('Add...')
      .should('be.enabled')
      .click()

    cy.get('input#surname')
      .clear()
      .type('Wisa')

    cy.get('input#wwccno')
      .clear()
      .type('01819845-02')

    cy.get('button#check')
      .contains('Check')
      .click()
    cy.get('.s-alert-error').should('exist')
    cy.get('div')
      .contains('Error: This family name and application/card number combination do not match')
      .should('exist')

    // Adds a wwcc number that fails - bad number

    cy.get('button[about="Cathrine King-add"]')
      .contains('Add...')
      .should('be.enabled')
      .click()

    cy.get('input#surname')
      .clear()
      .type('Wisa')

    cy.get('input#wwccno')
      .clear()
      .type('01819')

    cy.get('button#check')
      .contains('Check')
      .click()
    cy.get('.s-alert-error').should('exist')
    cy.get('div')
      .contains('Error: There was a problem submitting your request, one or more fields are missing or incorrect')
      .should('exist')

    // Adds a wwcc number that fails - unsuccessful number

    cy.get('button[about="Cathrine King-add"]')
      .contains('Add...')
      .should('be.enabled')
      .click()

    cy.get('input#surname')
      .clear()
      .type('Carmel')

    cy.get('input#wwccno')
      .clear()
      .type('01809845-02')

    cy.get('button#check')
      .contains('Check')
      .click()
    cy.get('.s-alert-error').should('exist')
    cy.get('div')
      .contains('Error: This family name and application/card number combination do not match')
      .should('exist')
  })
})
