/* Pseudo code for Working with Children Check (WWCC) 2

  * Open the application
  * Login as administrator
  * Navigate to /admin/wwcc
  * Find test member
  * Enter a valid WWCC, and check for success

  * Navigate to the member sign in page
  * Find test member
  * Confirm that WWCC check mark is present
  */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('Create an Cathrine King', function() {
  it(`Creates an Cathrine`, function() {
    cy.visit('/')
    addCathrine()
  })
})

// goes to the wwcc webpage
describe('Visit WWCC webpage', function() {
  it('Retrieves the WWCC webpage', function() {
    cy.visit('/admin/wwcc/')
    loginAsAdmin()

    cy.get('div[data-page="wwcc"]')
      .should('exist')
      .click()

    // Adds a wwcc number that works
    cy.get('button[about="Cathrine C-add"]')
      .contains('Add...')
      .should('be.enabled')
      .click()

    cy.get('input#surname')
      .clear()
      .type('Carmel')

    cy.get('input#wwccno')
      .clear()
      .type('04291284-02')

    cy.get('button#check')
      .contains('Check')
      .click()
    cy.get('.s-alert-success').should('exist')

    // Click the main button (not in the modal)
    //Clicks it again
    cy.get('button[about="Cathrine C"]')
      .contains('Check')
      .should('be.enabled')
      .click()
    cy.get('.s-alert-success').should('exist')

    cy.get('a[href="/volsignin"]').click()

    //  finds volunteer with wwcc number
    cy.get('[type="text"]')
      .clear()
      .type('Cathrine Carmel')
    cy.get('[type="text"]').clear()
    // At this point, only the card for our test subject should
    // be shown, and it should show the green tick to denote a valid WWC
    cy.get('[class="green check icon"]').should('exist')
    rmCathrineKing()
  })
})
