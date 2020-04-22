import { createPublicKey } from 'crypto'

/* Pseudo code for Multi Pass
  * Open the application
  
  * Navigate to /kiosk
  * Find test member
  * login on the member account
  * sign out of the member
  * Create loop which will iterate 10 times for this
  */

// This script is generic in nature. It only refers to the member object to get things
// like name, pin, etc
// So this is the only place where the code is specific to the person

describe('Create an Cathrine King', function() {
  it(`Creates an Cathrine`, function() {
    cy.visit('/')
    addCathrine()
  })
})
const { member } = team.cathrine
const numVisits = 3
member.pin = '2701'
// The rest of this code is generic...

describe('Login into Kiosk', function() {
  beforeEach(() => {
    cy.visit('/kiosk')
  })
  it('Open form - about you', function() {
    cy.visit('/kiosk')
    for (let i = 0; i < numVisits; i++) {
      cy.get('div[list="away"]')
        .contains(member.name)
        .should('exist')
        .click()

      cy.get('input[name="pinInput"]')
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

      cy.get('input[name="pinInput"]')
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
    rmCathrineKing()
  })
})
