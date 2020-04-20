/* Pseudo code for Multi Pass Jackie 
  * Open the application
  
  * Navigate to /kiosk
  * Find test member Jackie Chan
  * login on Jackie Chan
  * Add an event
  * sign of Jackie Chan
  * Create loop which will iterate 15 times for this
  */
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

const { member } = team.jackie
const numVisits = 3
describe('Login into Kiosk', function() {
  beforeEach(() => {
    cy.visit('/kiosk')
    rmSessions(member._id)
  })
  it('Adds 15 sessions to Jackie Chans profile', function() {
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

    cy.get('td')
      .contains(member.name)
      .should('exist')
      .click()

    cy.get('span[id="numPurchases"]').should('exist')

    cy.get('span[id="numSessions"]')
      .contains(numVisits)
      .should('exist')
  })
})
