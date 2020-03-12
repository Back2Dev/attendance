/* Pseudo code for pick5 stock test
  * navigate to the almsford application
  
  * click the get started button
  * add the stock choices and user info from data file
  * click the save button
  * loop 28 more times
  */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('Chooses 5 stock choices and saves them', function() {
  it('Visits the  almsford webpage', function() {
    picksAll.forEach(allPick => {
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
        .type(allPick.memberName)

      cy.get('input[id="pick_email"]')
        .clear()
        .type(allPick.email)

      cy.get('#pick1').type(allPick.pick1)

      cy.get('div')
        .contains(allPick.pick1 + ' ')
        .should('exist')
        .click({ force: true })

      cy.get('textarea[id="pick_reason"]')
        .clear()
        .type(allPick.reason)

      cy.get('#pick2').type(allPick.pick2)

      cy.get('div')
        .contains(allPick.pick2 + ' ')
        .click({ force: true })

      cy.get('#pick3').type(allPick.pick3)

      cy.get('div')
        .contains(allPick.pick3 + ' ')
        .click({ force: true })

      cy.get('#pick4').type(allPick.pick4)

      cy.get('div')
        .contains(allPick.pick4 + ' ')
        .click({ force: true })

      cy.get('#pick5').type(allPick.pick5)

      cy.get('div')
        .contains(allPick.pick5 + ' ')
        .click({ force: true })

      cy.get('button[id="save"]')
        .should('be.enabled')
        .click()

      cy.get('div')
        .contains('Thanks!')
        .should('exist')
    })
  })
})
