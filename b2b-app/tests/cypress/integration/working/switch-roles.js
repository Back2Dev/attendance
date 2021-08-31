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

  it('goes to the profile and swtiches roles', () => {
    cy.loginFromHomepage(users.admin.username, users.admin.password)
    cy.get('a[href = "/bookings"]').should('exist')
    cy.get('[data-cy="member-portal"]').should('exist')
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
