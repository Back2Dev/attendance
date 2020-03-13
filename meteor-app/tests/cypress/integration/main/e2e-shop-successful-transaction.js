const pin = '1234'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Shopping Payment', function() {
  it('Choose Product', function() {
    cy.visit('/shop/')
    cy.get('div').contains('Loading...')
    cy.get('#memberships').click()
    cy.get('button')
      .contains('Add to cart')
      .should('exist')
      .click()
  })
  it('Review Cart', function() {
    cy.get('button')
      .contains('Go to checkout now')
      .should('exist')
      .click()
  })
  it('Confirm Cart', function() {
    cy.get('button')
      .contains('Buy now')
      .should('exist')
      .click()
  })
  it('Add Personal Details', function() {
    cy.get('h2')
      .contains('Payment form - your address')
      .should('exist')
    cy.get('input[name="email"]')
      .clear()
      .type('manhhuyvo@gmail.com')
    cy.get('input[name="address_line1"]')
      .clear()
      .type('525 Williamstown Rd')
    cy.get('input[name="address_city"]')
      .clear()
      .type('Port Melbourne')
    cy.get('input[name="address_state"]')
      .clear()
      .type('VICTORIA')
    cy.get('input[name="address_postcode"]')
      .clear()
      .type('3000')
    cy.get('input[name="address_country"]')
      .clear()
      .type('AUSTRALIA')
    cy.get('button')
      .contains('Next')
      .click()
  })
  // Stop here, because in CI, it's not possible to reach the
  // PIN Payments site
  it('fills out card details', () => {
    Cypress.Commands.add('pinType', (field, text) => {
      cy.get('#' + field).within(() => {
        cy.get(`iframe`).then($iframe => {
          const body = $iframe.contents().find('body')
          cy.wrap(body)
            .find(`.${field}`)
            .type(text)
        })
      })
    })

    cy.wait(2000)
    cy.pinType('name', 'Mickey Moto')
    cy.pinType('number', '4242000000000000')
    cy.pinType('cvc', '000')
    cy.pinType('expiry', '12/22')
    cy.get('button')
      .contains('Pay')
      .click()
    cy.log('on the way')
    cy.get('span').contains('Preparing')
    //Can't seem to get past here, some incompatibility between Cypress and Pinpayments
    cy.get('span').contains('Transmitting')
    cy.get('h2').contains('Card payment receipt')
  })
  // it('Add Card Details', function() {
  //   cy.get('iframe.pin.name')
  //     .should('exist')
  //     .then(function($iframe) {
  //       //   cy.get('#name').within(() => {
  //       // cy.get('iframe')
  //       const iframe = $iframe.contents()
  //       const cardNameInput = iframe.find('#thisField')
  //       cardNameInput.val('Mikkel king')

  //       // setTimeout(() => {
  //       //   iframe.find('button').click()
  //       // }, 1000)

  //       return null
  //     })
  // })
})
