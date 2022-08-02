Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and create a form with an email type question', () => {
  before(function () {
    freshDatabase()
  })
  it('logs in from home page', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Email',
      type: 'text',
    })
    cy.addInputField({
      title: 'A',
      value: 'Enter email',
      type: 'email',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#email-enter-email').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    // give an invalid input
    cy.get('input#email-enter-email').type('invalidemail')
    cy.get('p#email-enter-email').should('exist')

    // give valid input
    cy.get('input#email-enter-email').clear().type('validemail@gmail.com')
    cy.get('p#email-enter-email').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
