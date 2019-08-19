const pin = '1234'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Empty Cart Loop', function() {
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
    it('Remove Product', function() {
        cy.get('button')
            .contains('X')
            .should('exist')
            .click()    
    })
    it('Back To Shop', function () {
        cy.get('button')
            .contains('Continue shopping')
            .should('exist')
            .click()
    })
})