Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('create a form', () => {
  before(function () {
    freshDatabase()
  })
  it('log in from hompage, create a form with paragraph input type', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Paragraph',
    })
    cy.addInputField({
      title: 'A',
      value: 'Enter paragraph',
      type: 'paragraph',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    //   // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#paragraph-enter-paragraph').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    // give a valid input
    cy.get('input#paragraph-enter-paragraph').clear().type('text')
    cy.get('p#paragraph-enter-paragraph').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
