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
    cy.get('button')
      .contains('Memberships')
      .click()
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
  it ('Confirm Cart', function() {
    cy.get('button')
      .contains('Buy now')
      .should('exist')
      .click()
  })
  it ('Add Personal Details', function() {
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
  it ('Add Card Details', function() {
      cy.get('#name').within(() => {
        // cy.get('iframe').then(function($iframe){
        //   const b = $iframe.contents().find("input")
        //   cy.wrap(b).click({force: true})
        // })
        cy.get('iframe').then($element => {

          const $body = $element.contents().find('body')
        
          let stripe = cy.wrap($body)
          stripe.find('input').eq(0).click().type('4242424242424242')      
        })
      })
  })
})