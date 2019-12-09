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

    // goes to the Assessment Webpage
    cy.get('button')
      .contains('Register')
      .click()

    cy.get('div')
      .contains('About You')
      .should('exist')
    // Nothing mandatory on the first page
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Contact details', () => {
    cy.get('div')
      .contains('Contact')
      .should('exist')
    // Try to move on
    cy.get('button')
      .contains('Next')
      .click()

    // Still on this page - add the name
    cy.get('div')
      .contains('Contact')
      .should('exist')
    cy.get('div')
      .contains('is a required property')
      .should('exist')
    cy.get('#root_name')
      .clear()
      .type('Eddie Mercx')
    // Still on this page add the email
    cy.get('#root_email')
      .clear()
      .type('Lift@spam.bogus.cliff.Recluse')

    // Still on this page add the mobile
    cy.get('#root_mobile')
      .clear()
      .type('111111111111')
    // Still on this page add the pin
    cy.get('div')
      .contains('Contact')
      .should('exist')
    cy.get('div')
      .contains('is a required property')
      .should('exist')
    cy.get('#root_pin')
      .clear()
      .type(pin)

    // Still on this page add the second (wrong) pin
    cy.get('div')
      .contains('Contact')
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
    cy.get('#root_privacy').click({ force: true })
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
      .should('exist')
      .should('be.enabled')
      .click()
    // check success alert shows
    cy.get('.s-alert-success').should('exist')
    cy.get('div[list="away"]')
      .contains('Eddie Mercx')
      .should('exist')
  })
  it('Can find and delete', () => {
    cy.visit('/admin/userprofiles')
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

    // //cy.get('div[list="away"]')
    //   // cy.get('.content,header')
    //   .contains('Eddie Mercx')
    //   .should('exist')
    cy.visit('/admin/userprofiles')
    cy.get('h1')
      .contains('Members')
      .should('exist')
    cy.get('.red ui button')
      //  cy.get('')
      .contains('Delete')
      .click()
    cy.get('.s-alert-success').should('exist')
  })
})
