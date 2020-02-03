/* Pseudo code for Multi Pass Rookie
  * Open the application
  
  * Navigate to /kiosk
  * Find test Rookie Paddler
  * login on Rookie Paddler
  * Add an event
  * sign of Rookie Paddler
  * Create loop which will iterate 15 times for this
  */
const { member } = team.rookie
const numVisits = 3
describe('Login into Kiosk', function() {
  beforeEach(() => {
    cy.visit('/kiosk')
    rmSessions(member._id)
  })
  it('Adds 15 sessions to Eddie Mercxs profile', function() {
    cy.visit('/kiosk')
    for (let i = 0; i < numVisits; i++) {
      cy.get('div[list="away"]')
        .contains(member.name)
        .should('exist')
        .click()

      cy.get('input[name=pinInput]')
        .clear()
        .type(member.pin)

      cy.get('button[id="group_kayak"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('button[id="done"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('[list="present"] > .ui')
        .contains(shortName(member.name))
        .should('exist')
        .click()

      cy.get('input[name=pinInput]')
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
      .contains(member.name)
      .should('exist')
      .click()

    cy.get('span[id="numPurchases"]').should('exist')

    cy.get('span[id="numSessions"]')
      .contains(numVisits)
      .should('exist')
  })
})
