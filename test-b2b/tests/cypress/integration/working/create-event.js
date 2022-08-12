Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and create an event in the calendar', () => {
  before(function () {
    freshDatabase()
  })

  it('logs on to the app, opens the admin menu and navigates to the calendar page', () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type('mike.king@mydomain.com.au')
    cy.get('[data-cy=password-input]').type('me2')
    cy.get('[data-cy=login-btn]').should('exist').click()
    cy.get('[data-cy=member-portal]').should('exist')

    cy.get(
      '[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root > .MuiSvgIcon-root'
    ).click()

    cy.get(
      '#primary-search-account-menu > .MuiPaper-root > .MuiList-root > :nth-child(2)'
    )
      .contains('Switch role')
      .click()
    cy.get('[value="ADM"]').last().click()

    cy.get('[data-cy=adm-drawer]').click()
    cy.getSettled('[data-cy=admin').click()

    cy.get('[href="/admin/calendar"]').click()

    //clicks a space on the calendar and adds an event
    cy.get('.fc-day-sat > .fc-daygrid-day-frame > .fc-daygrid-day-top')
      .contains('27')
      .should('exist')
      .click()
    cy.get('[name="name"]').clear().type('Intermediate river race')
    cy.get('[name="location"]').clear().type('Port Melbourne')
    cy.get('#tags-standard').clear().type('Fenn LS/Sandridge')
    cy.get('#tags-standard-option-0').click()
    cy.get('[data-gramm="false"] > div')
      .clear()
      .type('Come and have a paddle down the river')
    cy.get('[name="when"]').clear().type('2022-04-25T08:30')
    cy.get(
      ':nth-child(5) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
      .clear()
      .type("Trav's triangle/beginner")
    cy.get('[role="option"]').contains("Trav's triangle/beginner").click()
    cy.get('[name="duration"').clear().type('4')
    cy.get('[ name="price"]').clear().type('1300')
    cy.get(
      ':nth-child(4) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment'
    ).click()
    cy.get('[ role="option"]').contains("Trav's triangle/beginner").click()
    cy.get('.MuiDialogActions-root > :nth-child(2)').contains('Submit').click()
  })
})
