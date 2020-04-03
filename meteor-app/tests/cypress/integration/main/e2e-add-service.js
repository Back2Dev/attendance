/* Pseudo code for Service
  * Navigate to /login
  * Enter login details
  * Click on the Service
  * Pick Major service

  * Select different parts to add
  * Minimise indivual jobs within major serivce
  * Remove the major service
  * 
  * Enter minor service in search bar
  * Click on minor service
  * Add and remove extra parts
  * disable jobs with the minor service option
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

    cy.get('input[type="email"]')
      .should('exist')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[type="password"]')
      .should('exist')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('exist')
      .should('be.enabled')
      .click()

    cy.get('a[href="/service"]')
      .should('exist')
      .click()

    cy.get('input[type="text"]')
      .should('exist')
      .clear()
      .type('Maj')

    cy.get('div[class="title"]')
      .contains('Major Service')
      .should('exist')
      .click()

    cy.get('span[class="expand"]')
      .should('exist')
      .click()

    cy.get(':nth-child(10) > .handle')
      .should('exist')
      .click()

    cy.get(':nth-child(4) > .handle')
      .should('exist')
      .click()

    cy.get(':nth-child(2) > .handle')
      .should('exist')
      .click()

    cy.get('input[type="text"]')
      .should('exist')
      .clear()
      .type('spokes')

    cy.get('div[name="Spokes and nipples"]')
      .should('exist')
      .click()

    cy.get('.tag-wrapper > :nth-child(1) > .handle')
      .should('exist')
      .click()

    cy.get(':nth-child(1) > .handle')
      .should('exist')
      .click()
  })
})
