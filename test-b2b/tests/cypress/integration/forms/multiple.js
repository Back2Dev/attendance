import forms from '/tests/cypress/fixtures/forms'
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and create a form with a multiple question', () => {
  before(function () {
    freshDatabase() // This does a cy.visit('/') for us already
  })

  it('logs in from home page', () => {
    adminLogin('mike.king@mydomain.com.au', 'me2')
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('insert.forms', forms.multiple)
    })
    cy.getSettled('[data-cy=forms]').should('exist').click()
    cy.get(':nth-child(3) > .formatterCell > .MuiSvgIcon-root').click()
    // Compile and run the form...
    cy.getSettled('[data-cy="run-form"]').click()

    // check with missing inputs - first question is optional, so that's ok
    cy.get('[data-cy=next-step]').click()

    // check with missing inputs - second question needs all of them checked
    cy.get('[data-cy=next-step]').last().click()
    cy.get('[data-cy=next-step]').last().should('be.disabled')

    const sports =
      'golf soccer tennis footy squash croquet lawn-bowls trugo curling skiing'.split(
        /\s+/
      )
    sports.forEach((key) => {
      cy.get(`input[value="watch-${key}"]`).check()
    })
    cy.get('[data-cy=next-step]').last().should('be.enabled').click()

    cy.get('[data-cy=completed]').should('exist')
  })
})