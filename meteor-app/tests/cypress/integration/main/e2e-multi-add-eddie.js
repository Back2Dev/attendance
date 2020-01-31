/* Pseudo code for Multi Pass
  * Open the application
  
  * Navigate to /kiosk
  * Find test Eddie Merx
  * login on Eddie Merx
  * Add an event
  * sign of Eddie Merx
  * Create loop which will iterate 15 times for this
  */

describe('Login into Kiosk', function() {
  beforeEach(() => {
    cy.visit('/kiosk')
    rmSessions(team.eddie._id)
  })
  it('Adds 15 sessions to Eddie Mercxs profile', function() {
    cy.visit('/kiosk')
    // cy.get('list=["away"]').click()
    for (let i = 0; i < 15; i++) {
      cy.get('div[list="away"]')
        .contains('Eddie Mercx')
        .should('exist')
        .click()

      cy.get('input[name=pinInput]')
        .clear()
        .type('2803')

      cy.get('button[id="group_kayak"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('button[id="done"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('[list="present"] > .ui')
        .contains('Eddie M')
        .should('exist')
        .click()

      cy.get('input[name=pinInput]')
        .clear()

        .clear()
        .type(member.pin)

      cy.get('#signIn')
        .should('exist')
        .should('be.enabled')
        .click()
    }
    cy.visit('/admin/userprofiles/')
    loginAsAdmin()

    cy.get('div[class="header"]')
      .contains('Eddie Mercx')
      .should('exist')
      .click()

    cy.get('span[id="numPurchases"]')
      .should('exist')
      .should('equal') //(15)

    cy.get('span[id="numSessions"]')
      .should('exist')
      .shoul((15).to.equal(15))

    //  .should('equal') //(15)
  })
})
