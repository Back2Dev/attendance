import { createPublicKey } from 'crypto'

/* Pseudo code for Multi Pass
  * Open the application
  
  * Navigate to /kiosk
  * Find test member
  * login on the member account
  * sign out of the member
  * Create loop which will iterate 10 times for this
  */

describe('Login into Kiosk', function() {
  it('Open form - about you', function() {
    cy.visit('/kiosk')
    // cy.get('list=["away"]').click()
    for (let i = 0; i < 10; i++) {
      cy.get('div[list="away"]')
        .contains('Cathrine King')
        .should('exist')
        .click()

      cy.get('input[name="pinInput"]')
        .clear()
        .type('1234')

      cy.get('button[id="sas_squad"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('button[id="done"]')
        .should('be.enabled')
        .should('exist')
        .click()

      cy.get('[list="present"] > .ui')
        .contains('Cathrine K')
        .should('exist')
        .click()

      cy.get('input[name="pinInput"]')
        .clear()
        .type('1234')

      cy.get('#signIn')
        .should('exist')
        .should('be.enabled')
        .click()
    }

    cy.visit('/admin/userprofiles/')

    loginAsAdmin()

    cy.get('img[src=')
  })
})
