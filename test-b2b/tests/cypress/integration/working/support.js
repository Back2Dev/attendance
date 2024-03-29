import users from '/tests/cypress/fixtures/users.json'

describe('goes to support page', () => {
  beforeEach(() => {
    cy.loginFromHomepage(users.mike.username, users.mike.password)
    cy.get('a[href="/bookings"]')
  })
  it('goes to support page', () => {
    cy.get('#support-nav-item').contains('Support').click()
    cy.get('.MuiTypography-h1').contains('Contact the support team').should('exist')
    cy.get('input[name="subject"]').clear().type('A cry for help')
    cy.get('textarea[name="message"]')
      .clear()
      .type('This is the reason I am asking you to help me. ')
    cy.get('button#submit').should('exist').click()
    cy.get('[data-cy="thanks"]').should('exist')
  })
})
