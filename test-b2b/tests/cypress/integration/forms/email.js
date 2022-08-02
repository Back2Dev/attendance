Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('creates email input type', () => {
  before(function () {
    freshDatabase()
  })
  it('logs in from hompage', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Email',
      type: 'text',
      id: 'email',
    })
    cy.addInputField({
      title: 'A',
      value: 'Enter email',
      type: 'email',
      optional: true,
      id: 'email',
    })
  })
})
