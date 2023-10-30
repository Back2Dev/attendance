import forms from '/tests/cypress/fixtures/forms'
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and create a form with a multiple question', () => {
  before(function () {
    freshDatabase() // This does a cy.visit('/') for us already
  })

  it('logs in from home page', () => {
    adminLogin('mike.king@mydomain.com.au', 'me2')
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('insert.forms', forms.date)
    })
    cy.getSettled('[data-cy=forms]').should('exist').click()
    cy.get(':nth-child(3) > .formatterCell > .MuiSvgIcon-root').click()
    // Compile and run the form...
    cy.getSettled('[data-cy="run-form"]').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#enter-date-date').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    //   // give a valid input
    cy.get('.MuiPickersBasePicker-pickerView').should('not.exist')
    cy.get('#enter-date-date').next().find('button').click()
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
