const pin = '1234'
import memberData from '../../support/test-data-edit-profile'

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

describe('Create member', function() {
  it('Open form - about you', function() {
    cy.visit('/login')
    cy.get('input[name="email"]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name="password"]')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

    cy.get('a[href="/volsignin"]').click()

    cy.get('div[list="away"]')
      .should('exist')
      .contains('Cathrine C')
      .click()

    cy.get('input[name="pinInput"]')
      .clear()
      .type('2701')

    cy.get('button')
      .contains('Edit your profile')
      .click()
    //     cy.get('h1')
    //       .contains('No need to register')
    //       .should('exist')
    //     cy.get('#root_sports_0').click()
    //     cy.get('#root_reasons').type('Sports!')
    //     cy.get('button')
    //       .contains('Next')
    //       .click()
    //   })
    //   it('Contact details', function() {
    //     cy.get('h1')
    //       .contains('Details')
    //       .should('exist')
    //     cy.get('#root_name')
    //       .clear()
    //       .type(memberData.memberName)
    //     cy.get('#root_email')
    //       .clear()
    //       .type('test@test.com')
    //     cy.get('#root_addressStreet')
    //       .clear()
    //       .type('12 Lucky Street')
    //     cy.get('#root_addressSuburb')
    //       .clear()
    //       .type(memberData.suburb)
    //     cy.get('.ui > .search').type('VIC')
    //     cy.get('#root_addressPostcode')
    //       .clear()
    //       .type(memberData.postCode)
    //     cy.get('#root_phone')
    //       .clear()
    //       .type('NA')
    //     cy.get('#root_mobile')
    //       .clear()
    //       .type('0400 911 911')
    //     cy.get('#root_pin')
    //       .clear()
    //       .type(memberData.pinNo)
    //     cy.get('#root_pinConfirm')
    //       .clear()
    //       .type(memberData.pinNo)
    //     cy.get('#root_password')
    //       .clear()
    //       .type('1234')
    //     cy.get('#root_passwordConfirm')
    //       .clear()
    //       .type('1234')
    //     cy.get('button')
    //       .contains('Next')
    //       .click({ force: true })
    //   })
    //   it('Emergency contact details', function() {
    //     cy.get('h1')
    //       .contains('Who should we contact in an emergency')
    //       .should('exist')
    //     cy.get('#root_emergencyContact')
    //       .clear()
    //       .type('Jo King')
    //     cy.get('#root_emergencyEmail')
    //       .clear()
    //       .type('test@test.com')
    //     cy.get('#root_emergencyPhone')
    //       .clear()
    //       .type('1-111-222')
    //     cy.get('button')
    //       .contains('Next')
    //       .click()
    //   })
    //   it('Choose an avatar', function() {
    //     cy.get('h1')
    //       .contains('Choose an avatar')
    //       .should('exist')
    //     cy.get('img[src="/images/avatars/4.jpg"]').click()
    //     cy.get('button')
    //       .contains('Next')
    //       .click()
    //   })
    //   it('Accepts terms and agreements', () => {
    //     cy.get('.field-description').contains(
    //       'You must tick all of these'
    //     )
    //     cy.get(':nth-child(1) > :nth-child(1) > .ui > label').click()
    //     cy.get(':nth-child(2) > :nth-child(1) > .ui > label').click()
    //     cy.get(':nth-child(3) > :nth-child(1) > .ui > label').click()
    //     cy.get('button')
    //       .contains('Next')
    //       .click()
    //   })
    //   it('Review your details', function() {
    //     cy.get('h1')
    //       .contains('Review your details')
    //       .should('exist')
    //     cy.get('img[src="/images/avatars/4.jpg"]').should('exist')
    //     cy.get('span')
    //       .contains('Sports!')
    //       .should('exist')
    //     cy.get('span')
    //       .contains(memberData.pinNo)
    //       .should('exist')
    //     cy.get('span')
    //       .contains('Jo King')
    //       .should('exist')
    //     cy.get('span')
    //       .contains('1-111-222')
    //       .should('exist')
    //     cy.get('button')
    //       .contains('Submit')
    //       .click({ force: true })
    //     // check success alert shows
    //     cy.get('.s-alert-success').should('exist')
    //   })
    //   it('Find your name', function() {
    //     cy.get('input[placeholder="Search"]').should('exist')
    //     cy.get('div')
    //       .contains(memberData.memberName)
    //       .should('exist')
    //       .click()
    //     cy.contains(memberData.memberName).click()
    //     cy.get('input#pin').type(memberData.pinNo)
    //     cy.get('#group_kayak').should('exist')
    //   })
    // })

    // describe('Clean up', () => {
    //   beforeEach(function() {
    //     cy.visit('/kiosk')
    //   })
    //   it('Open from - about you', () => {
    //     cy.get('button')
    //       .contains('Register')
    //       .click()
    //     cy.get('h1')
    //       .contains(
    //         'No need to register if you are already signing in on the ipad at Sandridge'
    //       )
    //       .should('exist')
    //     cy.visit('/kiosk')
    //     cy.get('div[list="away"]').should('exist')

    //     // TODO: Currently it doesn't go back to /kiosk - this is a bug, when it is fixed, we can add a check to make sure it has gone back to the kiosk
  })
})
