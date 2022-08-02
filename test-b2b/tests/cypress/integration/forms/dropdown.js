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
  it('logs in from hompage, creates a form with dropdown input type', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Dropdown',
      type: 'dropdown',
    })
    cy.addInputField({
      title: 'A',
      value: 'value 1',
    })
    cy.addInputField({
      title: 'A',
      value: 'value 2',
    })
    cy.addInputField({
      title: 'A',
      value: 'value 3',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#dropdown').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    // give a valid input
    cy.get('div#dropdown').click({ force: true })
    cy.get('[data-value="value-1"]').click()
    cy.get('p#dropdown').should('not.exist')

    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
