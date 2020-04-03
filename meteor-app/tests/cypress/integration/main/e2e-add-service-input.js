/* Pseudo code for Input on the service page
  * Navigate to /login
  * Enter login details
  * Click on the Service menu item
  * Click on a input field/pill 
  * Enter the relevant details for the service
  
  * click checkboxes if 
  * Click on the submit button to create the service
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

    cy.get('.tabular :nth-child(2)')
      .should('exist')
      .click()

    cy.get('input[name="CustomerName"]')
      .should('exist')
      .clear({ force: true })
      .type('Dedrick Moss')
      .should('exist')

    cy.get('input[name="email"]')
      .should('exist')
      .clear({ force: true })
      .type('test@test.com')

    cy.get('input[name="phone"]')
      .should('exist')
      .clear({ force: true })
      .type('1122222222')

    cy.get('input[name="bikeBrand"]')
      .should('exist')
      .clear({ force: true })
      .type('Shimano')

    cy.get('input[name="bikeName"]')
      .should('exist')
      .clear({ force: true })
      .type('Wolf3000Zs')

    cy.get('input[name="bikeColor"]')
      .should('exist')
      .clear({ force: true })
      .type('Magenta')

    cy.get('input[name="replacement"]')
      .should('exist')
      .click()

    cy.get('button')
      .contains('Submit')
      .should('exist')
      .should('be.enabled')
      .click()
  })
})
