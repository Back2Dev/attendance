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
      await win.Meteor.callAsync('insert.forms', forms.address)
    })
    cy.getSettled('[data-cy=forms]').should('exist').click()
    cy.get(':nth-child(3) > .formatterCell > .MuiSvgIcon-root').click()
    // Compile and run the form...
    cy.getSettled('[data-cy="run-form"]').click()
    //   // give a valid input
    cy.get('#google-places-search-popup').should('not.exist')
    cy.get('input#google-places-search').type('14 Ashley St')
    cy.get('#google-places-search-popup').should('exist')
    cy.get('[id="google-places-search-option-0"]').click()

    cy.get('p#address-enter-address').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
