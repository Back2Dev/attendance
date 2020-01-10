/* Pseudo code for Working with Children Check (WWCC)

  * Open the application
  * Login as administrator
  * Navigate to /admin/wwcc
  * Find test member
  * Enter a valid WWCC, and check for success

  * Navigate to the member sign in page
  * Find test member
  * Confirm that WWCC check mark is present

  * Navigate to /admin/wwcc
  * Find a test member
  * Enter a valid WWCC, and Enter a invalid surname
  * Check if error message is displayed, with info about wrong surname

  * Find a test member
  * Enter a invalid WWCC
  * Check for error message
*/

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

// goes to the wwcc webpage
describe('Visit WWCC webpage', function() {
  it('Retrieves the WWCC webpage', function() {
    cy.visit('/admin/wwcc/')
    loginAsAdmin()

    cy.get('div[data-page="wwcc"]')
      .should('exist')
      .click()
  })

  it('Adds a wwcc number that works', function() {
    cy.get('button[about="Cathrine King-add"]')
      .contains('Add...')
      .should('be.enabled')
      .click()

    cy.get('input#surname')
      .clear()
      .type('King')

    cy.get('input#wwccno')
      .clear()
      .type('01819845-02')

    cy.get('button#check')
      .contains('Check')
      .click()
    cy.get('.s-alert-success').should('exist')
  })

  // Click the main button (not in the modal)
  it('Clicks it again', function() {
    cy.get('button[about="Cathrine King"]')
      .contains('Check')
      .should('be.enabled')
      .click()
    cy.get('.s-alert-success').should('exist')
  })

  it('Retrieves the kiosk webpage ', function() {
    loginAsAdmin()
    cy.get('a[href="/volsignin"]').click()
  })

  it('finds volunteer with wwcc number', function() {
    cy.get('[type="text"]')
      .clear()
      .type('Cathrine King')
    cy.get('[type="text"]').clear()

    // At this point, only the card for our test subject should
    // be shown, and it should show the green tick to denote a valid WWCC

    cy.get('[class="green check icon"]').should('exist')
    cy.get('[type="text"]').clear()
  })

  it('Adds a wwcc number that fails - name mismatch', function() {
    cy.visit('/admin/wwcc/')
    loginAsAdmin()
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
  })

  it('Adds a wwcc number that fails - bad number', function() {
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
  })
})
