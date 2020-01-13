/* Pseudo code for Working with Children Check (WWCC)

Open the application
Login as administrator
Navigate to /admin/wwcc
Find test member
Enter a valid WWCC, and check for success
Navigate to the member sign in page
Find test member
Confirm that WWCC check mark is present

9. Navigate to /admin/wwcc
Find a test member
Enter a valid WWCC, and Enter a invalid surname
Check if error message is displayed, with info about wrong surname
Confirm that error message has been displayed

Find a test member
enter a invalid WWCC, and check for error  message
confirm that error message has been displayed, and has correct info
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
    login('admin@back2bikes.com.au', 'me2')
    // cy.get('input[name=email]')
    //   .clear()
    //   .type('admin@back2bikes.com.au')

    // cy.get('input[name=password]')
    //   .clear()
    //   .type('me2')
    // // .contains('Password')

    // cy.get('button')
    //   .contains('Submit')
    //   .should('be.enabled')
    //   .click()

    cy.get('div[data-page="wwcc"]')
      .should('exist')
      .click()

    // Adds a wwcc number that works
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

    // Click the main button (not in the modal)
    //Clicks it again
    cy.get('button[about="Cathrine King"]')
      .contains('Check')
      .should('be.enabled')
      .click()
    cy.get('.s-alert-success').should('exist')
  })

  it('Retrieves the kiosk webpage ', function() {
    login('admin@back2bikes.com.au', 'me2')
    cy.get('a[href="/volsignin"]').click()

    //  finds volunteer with wwcc number
    cy.get('[type="text"]')
      .clear()
      .type('Cathrine King')

    cy.get('[class="green check icon"]').should('exist')
  })
  // can't run indpentandt on ly fail
  it('Retrieves the WWCC webpage', function() {
    cy.get('[type="text"]').clear()

    cy.get('a[href="/login"]').click()

    cy.get('input[name=email]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name=password]')
      .clear()
      .type('me2')
    // .contains('Password')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

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
  })
})
