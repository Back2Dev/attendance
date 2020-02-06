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

describe('Chooses 5 stock choices and saves them', function() {
  it('Visits the  almsford webpage', function() {
    cy.visit('http://almsford.org/')

    // checks whether the it has  navigated to the correct website
    cy.get('h1')
      .should('exist')
      .contains('Top 5 stock picks')

    cy.get('a[href="/picks"]').click()

    cy.get('h1')
      .should('exist')
      .contains('Top 5 picks')

    cy.get('input[name="memberName"]')
      .clear()
      .type('Eddie mercx')

    cy.get('input[id="pick_email"]').type('Edddie@mercx.phony.mail')

    cy.get('#pick1')
      .click()
      .type('ctd')
      .click('')

    cy.get('input[id="pick_reason"]')
      .type('Very cheap right now')
      .click()

    cy.get('#pick2')
      .type('iri')
      .click()
    cy.get('ul:even').click()

    cy.get('#pick3')
      .type('ocl')
      .click()
    cy.get('ul:odd').click()

    cy.get('#pick4')
      .type('nck')
      .click()
    cy.get('ul:even').click()
    cy.get('#pick5')
      .type('abc')
      .click()

    cy.get('ul:odd').click()
  })
})
