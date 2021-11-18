Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)
describe('Create event', () => {
  before(function () {
    freshDatabase()
  })
  it('Navigate to events', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(this.users.mgr.username)
    cy.get('[data-cy=password-input]').type(this.users.mgr.password)
    cy.get('[data-cy=login-btn]').click()
    cy.get('[data-cy=adm-drawer]').click()
    cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root').click()
    cy.get('[href="/admin/events"]').should('exist').click()
    cy.get('#add').should('exist')
  })
})
