// Cypress.on(
//   'uncaught:exception',
//   (err, runnable) =>
//     // returning false here prevents Cypress from
//     // failing the test. We do this because of some ugly js errors
//     // from a js library we are using
//     false
// )

describe('opens the new platform and tests the email login function', () => {
  before(function () {
    freshDatabase()
  })

  it('navigates to Back2bikes homepage and enters information and clicks sign in', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(this.users.mike.username)
    cy.get('[data-cy=password-input]').type(this.users.mike.password)
    cy.get('[data-cy=login-btn]').should('exist').click()
    // cy.get('[data-cy="welcome"]').should('exist')
    cy.wait(400)
    cy.get('[data-cy="member-portal"]').should('exist')
  })
})
