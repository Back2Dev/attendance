import dude from '../../support/test-data-jackie-chan'

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
const numVisits = 5
const pin = '1--1'
// The rest of this code is generic...

describe('Login into Kiosk', function() {
  beforeEach(() => {
    cy.visit('/kiosk')
  })
  it('Open form - about you', function() {
    cy.visit('/kiosk')
    for (let i = 0; i < numVisits; i++) {
      cy.get('div[list="away"]')
        .contains(dude.member.name)
        .should('exist')
        .click()

      cy.get('input[name="pinInput"]')
        .clear()
        .type(pin)

      cy.get('button[id="group_kayak"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('button[id="done"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('[list="present"] > .ui')
        .contains(shortName(dude.member.name))
        .should('exist')
        .click()

      cy.get('input[name="pinInput"]')
        .clear()
        .type(pin)

      cy.get('#signIn')
        .should('exist')
        .should('be.enabled')
        .click()
    }

    cy.visit('/admin/userprofiles/')
    loginAsAdmin()

    cy.get('div[class="header"]')
      .contains(dude.member.name)
      .should('exist')
      .click()

    cy.get('span[id="numPurchases"]').should('exist')
  })
})

describe('Create a Jackie Chan', function() {
  it(`Creates a Jackie`, function() {
    cy.visit('/')
    addJackie()
  })
})
