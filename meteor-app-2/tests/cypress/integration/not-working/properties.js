Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)
describe('Create property', () => {
  beforeEach(function () {
    cy.visit('/properties')
    loadCypressFixtures()
    // dont use UI to log in
    // https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-In
  })

  it('Navigate to properties', function () {
    login(this.users.admin.user, this.users.admin.password)
    cy.get('a[href="/properties"]').click()
    cy.get('button').contains('Add').click()
    cy.get('#add').click()
    cy.get('button').contains('Next').click()
  })
})
