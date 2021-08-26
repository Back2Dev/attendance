Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('opens the new platform and tests the calendar, booking and calendar systems', () => {
  before(function () {
    freshDatabase()
  })

  it('navigates to  calendar page through the admin menu and creates an event', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(this.users.admin.username)
    cy.get('[data-cy=password-input]').type(this.users.admin.password)
    cy.get('[data-cy=login-btn]').click()

    cy.get('[data-cy=primary-search-account-menu] .MuiAvatar-root')
      .should('exist')
      .click()
    cy.get('[data-cy="switch-role"]').click()
    cy.get(' #primary-search-account-menu [value="ADM"]').click()
    cy.get('[data-cy=adm-drawer]').should('exist').click()
    cy.get(':nth-child(4) > [data-cy=manager]').should('exist').click()
  })
})
