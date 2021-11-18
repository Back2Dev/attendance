import users from '/tests/cypress/fixtures/users.json'

Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('switch user roles', () => {
  before(function () {
    freshDatabase()
  })
  
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  })

  it('goes to the profile and swtiches roles', () => {
    cy.get('#login-nav-item').should('exist').click()
    cy.loginFromHomepage(users.mgr.username,users.mgr.password)
    cy.get('a[href = "/properties"]').should('exist')
    cy.get('[data-cy="welcome"]').should('exist')
    cy.get(
      '[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root'
    ).click()
    cy.get('#primary-search-account-menu > .MuiPaper-root > .MuiList-root').should(
      'exist'
    )
    cy.get('[data-cy=a-tag-profile]').click()
    cy.get('[data-cy=user-account]').should('exist')
  })
})
