/* Pseudo code for Multi Pass
  * Open the application
  
  * Navigate to /kiosk
  * Find test Bruce Lee
  * login on Bruce Lee
  * Add an event
  * sign of Bruce Lee
  * Create loop which will iterate 15 times for this
  */

describe('Login into Kiosk', function() {
  it('Adds 15 sessions to Bruce lees profile', function() {
    cy.visit('/kiosk')
    // cy.get('list=["away"]').click()
    for (let i = 0; i < 15; i++) {
      cy.get('div[list="away"]')
        .contains('Bruce Lee')
        .should('exist')
        .click()

      cy.get('input[name="pinInput"]')
        .clear()
        .type('2405')

      cy.get('button[id="group_kayak"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('button[id="done"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('[list="present"] > .ui')
        .contains('Bruce L')
        .should('exist')
        .click()

      cy.get('input[name="pinInput"]')
        .clear()
        .type('2405')

      cy.get('#signIn')
        .should('exist')
        .should('be.enabled')
        .click()
    }
    cy.get('span[id="numPurchases"]').should('exist')

    cy.get('span[id="numSessions"]').should('exist')
  })
})
