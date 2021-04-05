Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('opens the new platform and tests the google login function', () => {
  before(function () {
    freshDatabase()
  })

  it('navigates to  startup inc homepage and enters information and clicks sign in', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(this.users.pm.username)
    cy.get('[data-cy=password-input]').type(this.users.pm.password)
    cy.get('[data-cy=login-btn]').should('exist').click()
    cy.get('[data-cy="welcome"]').should('exist')
  })
})
