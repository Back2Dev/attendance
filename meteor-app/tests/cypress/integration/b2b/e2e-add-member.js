/*
  * go to /add to add a member
  * enter details for the  new member
  * Add a password to access the member portal
  * login with the member details
  * check for the name and details of the member
  * check for the number of passes
  * check for the credit card button
  * click the update button
  
  */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Adds Member to portal', function() {
  it('creates a volunteer', function() {
    cy.visit('/add')

    cy.get('#root_bikesHousehold')
      .clear()
      .type('4')

    // TODO: eliminate use of nth-child
    cy.get('div[role="combobox"]')
      .contains('Select a type of bike')
      .should('exist')
      .click()

    cy.get('div[role="option"]')
      .contains('Ladies')
      .should('exist')
      .click()

    cy.get('div[role="combobox"]')
      .contains('Select your employment status')
      .should('exist')
      .click()

    cy.get('div[role="option"]')
      .contains('Pension/Disability')
      .click()

    cy.get('button[type="submit"]')
      .contains('Next')
      .should('be.enabled')
      .click()

    cy.get('#root_name')
      .clear()
      .type('Ginny Tonic')

    cy.get('#root_email')
      .clear()
      .type('tests@test.com')

    cy.get('#root_addressStreet')
      .clear()
      .type('12 potted plant grove')

    cy.get('#root_addressSuburb')
      .clear()
      .type('Gangnam')

    cy.get('div[role="combobox"]')
      .contains('Enter your state')
      .click()

    cy.get('div[role="option"]')
      .contains('VIC')
      .click()

    cy.get('#root_addressPostcode')
      .clear()
      .type('3000')

    cy.get('#root_mobile')
      .clear()
      .type('111 101 211')

    cy.get('#root_pin')
      .clear()
      .type('2713')

    cy.get('#root_pinConfirm')
      .clear()
      .type('2713')

    cy.get('button[type="submit"]')
      .contains('Next')
      .should('be.enabled')
      .click()

    cy.get('#root_emergencyContact')
      .clear()
      .type('Do Bong Soon')

    cy.get('#root_emergencyEmail')
      .clear()
      .type('intern.do@dointern.com.GCS.RX')

    cy.get('#root_emergencyPhone')
      .clear()
      .type('999-000-110')

    cy.get('button')
      .contains('Next')
      .should('be.enabled')
      .click()

    cy.get('img[src="/images/avatars/test21.png"]').click()

    cy.get('button[type="submit"]')
      .contains('Next')
      .should('be.enabled')
      .click()

    cy.get('#root_privacy')
      .should('exist')
      .click({ force: true })

    cy.get('button[type="submit"]')
      .contains('Next')
      .should('be.enabled')
      .click()

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

    cy.visit('/kiosk')

    cy.get('div[list="away"]')
      .contains('Ginny Tonic')
      .should('exist')
      .click()

    cy.get('#pin')
      .clear()
      .type('2713')

    cy.get('button')
      .contains('Edit your profile')
      .should('be.enabled')
      .should('exist')
      .click()

    cy.get('button[id="edit-password"]')
      .should('be.enabled')
      .should('exist')
      .click()

    cy.get(':nth-child(2) > .ui > input')
      .clear()
      .type('2713')

    cy.get(':nth-child(3) > .ui > input')
      .clear()
      .type('2713')

    cy.get('  :nth-child(5) > .ui > input')
      .clear()
      .type('2713')

    cy.get('button')
      .contains('Submit')
      .should('exist')
      .should('be.enabled')
      .click()

    cy.get('#edit-contact').click()

    cy.get('button')
      .contains('Update')
      .should('exist')
      .should('be.enabled')
      .click()

    // TODO: Currently it doesn't go back to /kiosk - this is a bug, when it is fixed, we can add a check to make sure it has gone back to the kiosk
  })
})
