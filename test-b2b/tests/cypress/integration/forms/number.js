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
  it('logs in from hompage, creates a form with number input type', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Number',
      type: 'text',
    })
    cy.addInputField({
      title: 'A',
      value: 'Enter number',
      type: 'number',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    //   // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#number-enter-number').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    //   // give an invalid input
    cy.get('input#number-enter-number').type('text')
    cy.get('p#number-enter-number').should('exist')

    //   // give a valid input
    cy.get('input#number-enter-number').clear().type('12321312')
    cy.get('p#number-enter-number').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
