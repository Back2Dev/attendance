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

  // todo write code to detect errors
  // TODO: forms.number use text Maybe we should change it to number(num)
  it('logs in from home page', () => {
    adminLogin('mike.king@mydomain.com.au', 'me2')
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('insert.forms', forms.number)
    })
    cy.getSettled('[data-cy=forms]').should('exist').click()
    cy.get(':nth-child(3) > .formatterCell > .MuiSvgIcon-root').click()
    // Compile and run the form...
    cy.getSettled('[data-cy="run-form"]').click()

    //   // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('[data-cy="next-step"]').should('be.disabled')

    //   // give an invalid input
    cy.get('input#enter-costs-costs').type('text')
    cy.get('[data-cy="next-step"]').should('be.enabled')

    //   // give a valid input
    cy.get('input#enter-costs-costs').clear().type('12321312')
    cy.get('[data-cy="next-step"]').should('be.enabled')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
