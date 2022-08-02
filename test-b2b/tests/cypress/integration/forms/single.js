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
  it('logs in from hompage, creates a form with single input type', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Single',
      type: 'single',
      id: 'single',
    })
    cy.addInputField({
      title: 'A',
      value: 'Pls select 1',
    })
    cy.addInputField({
      title: 'A',
      value: 'Pls select 2',
    })
    cy.addInputField({
      title: 'A',
      value: 'Pls select 3',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#single').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    //   // give a valid input
    cy.get('[value="pls-select-1"]').click()
    cy.get('p#text-enter-text').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
