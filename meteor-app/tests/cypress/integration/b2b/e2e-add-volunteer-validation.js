const pin = '1234'

Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('Create member', () => {
  it('Open form - about you', () => {
    cy.visit('/kiosk')
    //cy.get('#add_member').click()
    cy.get('button')
      .contains('Register')
      .click()
    cy.get('div')
      .contains('Lets get to know each other')
      //.contains('No need to register')
      .should('exist')
    // Nothing mandatory on the first page
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Contact details', () => {
    cy.get('h1')
      .contains('Details')
      .should('exist')
    // Try to move on
    cy.get('button')
      .contains('Next')
      .click()

    // Still on this page - add the name
    cy.get('h1')
      .contains('Details')
      .should('exist')
    cy.get('div')
      .contains('is a required property')
      .should('exist')
    cy.get('#root_name')
      .clear()
      .type('Eddie Mercx')

    // Still on this page add the mobile number
    cy.get('h1')
      .contains('Details')
      .should('exist')
    cy.get('div')
      .contains('is a required property')
      .should('exist')
    cy.get('#root_mobile')
      .clear()
      .type('111111111111')

    // Still on this page add the email
    cy.get('h1')
      .contains('Details')
      .should('exist')
    cy.get('div')
      .contains('is a required property')
      .should('exist')
    cy.get('#root_email')
      .clear()
      .type('Lift@spam.bogus.cliff.Recluse')

    // Still on this page add the pin
    cy.get('h1')
      .contains('Details')
      .should('exist')
    cy.get('div')
      .contains('is a required property')
      .should('exist')
    cy.get('#root_pin')
      .clear()
      .type(pin)

    // Still on this page add the second (wrong) pin
    cy.get('h1')
      .contains('Details')
      .should('exist')
    cy.get('div')
      .contains("PIN numbers don't match")
      .should('exist')
    cy.get('#root_pinConfirm')
      .clear()
      .type('0909')
    cy.get('div')
      .contains("PIN numbers don't match")
      .should('exist')

    // Get the pin right now and move on
    cy.get('#root_pinConfirm')
      .clear()
      .type(pin)

    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Emergency contact details', () => {
    cy.get('h1')
      .contains('Who should we contact in an emergency')
      .should('exist')
    cy.get('#root_emergencyContact')
      .clear()
      .type('Miguel Indirain')
    cy.get('#root_emergencyPhone')
      .clear()
      .type('1-111-222')
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Choose an avatar', () => {
    cy.get('h1')
      .contains('Choose an avatar')
      .should('exist')
    cy.get('img[src="/images/avatars/12.jpg"]').click()
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Terms', function() {
    cy.get('h1')
      .contains('Terms and Conditions')
      .should('exist')
    cy.get('input[id="root_privacy"]').click({ force: true })
    // cy.get('#root_swim').click({ force: true })
    // cy.get('#root_terms').click({ force: true })
    // cy.get('#root_fitness').click({ force: true })
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Review your details', () => {
    cy.get('h1')
      .contains('Review your details')
      .should('exist')
    cy.get('img[src="/images/avatars/12.jpg"]').should('exist')
    cy.get('span')
      .contains(pin)
      .should('exist')
    cy.get('span')
      .contains('1-111-222')
      .should('exist')
    cy.get('button')
      .contains('Submit')
      .click()
    // check success alert shows
    cy.get('.s-alert-success').should('exist')
    cy.get('div[list="away"]')
      .contains('Eddie Mercx')
      .should('exist')
  })
})
