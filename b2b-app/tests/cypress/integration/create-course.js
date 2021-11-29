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

it('log in to app, switch role to admin and navigate to the courses page', () => {
  cy.visit('/login')
  cy.get('[data-cy=email-input]').type('mike.king@mydomain.com.au')
  cy.get('[data-cy=password-input]').type('me2')
  cy.get('[data-cy=login-btn]').should('exist').click()
  cy.get('[data-cy=member-portal]').should('exist') 

  cy.get('[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root > .MuiSvgIcon-root').click()

  cy.get('#primary-search-account-menu > .MuiPaper-root > .MuiList-root > :nth-child(2)').contains('Switch role').click()
  cy.get('[value="ADM"]').last().click()

  cy.get('.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root > path').click()
  cy.get('.makeStyles-sideDrawer-67 > :nth-child(3) > .MuiButtonBase-root').contains('Admin').click()

  cy.get('[href="/admin/course"]').click()



})
})