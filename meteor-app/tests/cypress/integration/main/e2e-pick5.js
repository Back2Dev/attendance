import Pick5 from '../../support/test-data-pick5'
import holdings from '../../support/test-data-pick5'

/* Pseudo code for pick5 stock test
  * navigate to the almsford application
  
  * click the get started button
  * add the stock choices and  user information
  * click the save button
 
  */
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
const { holdings } = Picks5.shares
describe('Chooses 5 stock choices and saves them', function() {
  it('Visits the  almsford webpage', function() {
    cy.visit('http://almsford.org/')

    // checks whether the it has  navigated to the correct website
    describe('Login into Kiosk', function() {
      cy.get('h1')
        .should('exist')
        .contains('Top 5 stock picks')

      cy.get('a[href="/picks"]').click()

      cy.get('h1')
        .should('exist')
        .contains('Top 5 picks')

      cy.get('input[name="memberName"]')
        .clear()
        .type(Picks5.)

      cy.get('input[id="pick_email"]').type('Edddie@mercx.phony.mail')

      cy.get('#pick1').type('ctd')

      cy.get('div')
        .contains('CTD ')
        .click()

      cy.get('input[id="pick_reason"]').type('Very cheap right now')

      cy.get('#pick2').type('iri')

      cy.get('div')
        .contains('IRI ')
        .click()

      cy.get('#pick3').type('ocl')

      cy.get('div')
        .contains('OCL ')
        .click()

      cy.get('#pick4').type('nck')

      cy.get('div')
        .contains('NCK ')
        .click()

      cy.get('#pick5').type('abc')
      cy.get('div')
        .contains('ABC ')
        .click()

      cy.get('button[id="save"')
        .should('be.enabled')
        .click()

      cy.get('h1[id="thanks"]').should('exist')
    })
  })
})
