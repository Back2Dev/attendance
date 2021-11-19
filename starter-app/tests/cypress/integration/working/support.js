import users from '/tests/cypress/fixtures/users.json'

// TODO: add backend service

describe('goes to support page', () => {
  beforeEach(() => {
    cy.loginFromHomepage(users.customer.username, users.customer.password)
    cy.get('a[href="/properties"]')
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
