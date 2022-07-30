import forms from '/tests/cypress/fixtures/forms'
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and exercises the signature question', () => {
  before(function () {
    freshDatabase()
  })

  it('logs in from home page', () => {
    adminLogin('mike.king@mydomain.com.au', 'me2')
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('insert.forms', forms.signature)
    })
    cy.getSettled('[data-cy=forms]').should('exist').click()
    cy.get(':nth-child(3) > .formatterCell > .MuiSvgIcon-root').click()
    // Compile and run the form...
    cy.getSettled('[data-cy="run-form"]').click()

    // check with missing inputs - first question is optional, so that's ok
    cy.get('[data-cy=next-step]').click()
    cy.get('[data-cy=next-step]').last().should('be.disabled')

    // Clicking on the canvas seems to satisfy the validation that it's not empty
    cy.get('.sigCanvas').click()
    cy.get('[data-cy=next-step]').last().should('be.enabled').click()

    cy.get('[data-cy=completed]').should('exist')
  })
})
