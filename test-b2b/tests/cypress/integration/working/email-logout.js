Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('navigates to the landing page', () => {
  before(function () {
    freshDatabase()
  })

  it('navigates to  Back2bikes homepage and enters information and clicks sign in', function () {
    cy.visit('/bookings')
    login(this.users.mike.username, this.users.mike.password)
    cy.get('[data-cy=primary-search-account-menu]').first().click()
    cy.get('[data-cy="logout-menu"]').should('exist').click()
    cy.get('[data-cy="logged-out"]').should('exist')
  })
})
