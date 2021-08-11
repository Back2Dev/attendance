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
    cy.visit('/properties')
    login(this.users.pm.username, this.users.pm.password)
    cy.get('[data-cy=primary-search-account-menu]').first().click()
    cy.get(
      '#primary-search-account-menu > .MuiPaper-root > .MuiList-root > li.MuiButtonBase-root'
    )
      .should('exist')
      .click()
    cy.get('[data-cy="logged-out"]').should('exist')
  })
})
