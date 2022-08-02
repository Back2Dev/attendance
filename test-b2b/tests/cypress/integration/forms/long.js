Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('creates a form', () => {
  before(function () {
    freshDatabase()
  })
  it('logs in from hompage, creates a form with long input type', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Long text',
      type: 'text',
    })
    cy.addInputField({
      title: 'A',
      value: 'Enter long text',
      type: 'long',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#long-text-enter-long-text').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    // give a valid input
    cy.get('textarea#long-text-enter-long-text').type('This is the a long text')
    cy.get('p#long-text-enter-long-text').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
