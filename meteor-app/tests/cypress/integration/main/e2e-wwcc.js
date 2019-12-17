Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

// goes to the wwcc webpage
describe('Visit WWCC webpage', function() {
  it('Retrieves the WWCC webpage', function() {
    cy.visit('/admin/login/')

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

    cy.visit('/admin/wwcc/')
  })

  it('Adds a wwcc number', function() {
    cy.get('.button').contains('Add...')

    cy.get('.button')
      .contains('Add...')
      .should('be.enabled')
      .click()

    cy.get('.button')
      .contains('Check')
      .click()
  })
})
