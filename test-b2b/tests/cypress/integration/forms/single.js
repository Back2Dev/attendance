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
      await win.Meteor.callAsync('insert.forms', forms.single)
    })
    cy.getSettled('[data-cy=forms]').should('exist').click()
    // Compile and run the form...
    cy.get(':nth-child(3) > .formatterCell > .MuiSvgIcon-root').click()

    cy.getSettled('[data-cy="run-form"]').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#select-a-practice').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    //   // give a valid input
    cy.get('[value="vic"]').click()
    cy.get('p#select-a-practice').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
