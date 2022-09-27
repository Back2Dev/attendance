import forms from '/tests/cypress/fixtures/forms'
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and create a form with a long question', () => {
  before(function () {
    freshDatabase() // This does a cy.visit('/') for us already
  })
  // todo enter code for better validation

  it('logs in from home page', () => {
    adminLogin('mike.king@mydomain.com.au', 'me2')
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('insert.forms', forms.long)
    })
    cy.getSettled('[data-cy=forms]').should('exist').click()
    cy.get(':nth-child(3) > .formatterCell > .MuiSvgIcon-root').click()
    // Compile and run the form...
    cy.getSettled('[data-cy="run-form"]').click()

    cy.get('.editorTools > span > button:nth-child(2)').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('#enter-adornment-cost-long-label').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    // give a valid input
    cy.get('textarea#enter-adornment-cost-long').type('This is the a long text')
    cy.get('[data-cy="next-step"]').click()
    cy.get('#enter-adornment-cost-long-label').should('not.exist')
    cy.get('[data-cy=completed]').should('exist')
  })
})
