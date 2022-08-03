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
  it('logs in from hompage, creates a form with date input type', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Date',
      type: 'text',
    })
    cy.addInputField({
      title: 'A',
      value: 'Enter date',
      type: 'date',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#date-enter-date').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    //   // give a valid input
    cy.get('.MuiPickersBasePicker-pickerView').should('not.exist')
    cy.get('#date-enter-date-label').next().find('button').click()
    cy.get('.MuiPickersBasePicker-pickerView')
      .find('.MuiPickersCalendar-week:nth-child(2)>div')
      .eq(0)
      .click()
    cy.get('button').contains('OK').click()
    cy.get('p#date-enter-date').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
