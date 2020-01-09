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

    // cy.visit('/admin/wwcc/')
    cy.get('div[data-page="wwcc"]')
      .should('exist')
      .click()
  })

  it('Adds a wwcc number that works', function() {
    // cy.visit('/admin/wwcc/')
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
    // cy.get('.item')
    //   .contains('Login')
    //   .should('exist')
    //   .click()
    cy.visit('/kiosk/')
  })
  it('finds volunteer with wwcc number', function() {
    cy.get('.input').type('Cathrine King')
    //  .contains('Search')
    //   .clear()
    //   .type('Cathrine')
  })
  it('Retrieves the WWCC webpage', function() {
    cy.get('.input')
      .contains('Cathrine King')
      .clear()

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

    // cy.visit('/admin/wwcc/')
    cy.get('div[data-page="wwcc"]')
      .should('exist')
      .click()
  })

  it('Adds a wwcc number that fails - name mismatch', function() {
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
