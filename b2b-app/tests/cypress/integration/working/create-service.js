Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and create a service', () => {
  before(function () {
    freshDatabase()
  })
  // afterEach(function () {
  //   if (this.currentTest.state === 'failed') {
  //     Cypress.runner.stop()
  //   }
  // })
it('navigates to Back2bikes homepage logs in and switches role to admin', function () {
  cy.visit('/login')
  cy.get('[data-cy=email-input]').type(this.users.mike.username)
  cy.get('[data-cy=password-input]').type(this.users.mike.password)
  cy.get('[data-cy=login-btn]').should('exist').click()
  cy.get('[data-cy=member-portal]').should('exist')

  cy.get('[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root > .MuiSvgIcon-root').click()

  cy.get('#primary-search-account-menu > .MuiPaper-root > .MuiList-root > :nth-child(2)').contains('Switch role').click()
  cy.get('[value="ADM"]').last().click()
})

it('opens admin menu and navigates to create service page and adds minor service', function () {
 cy.get('.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root > path').click()
 cy.get('.makeStyles-sideDrawer-67 > :nth-child(4) > .MuiButtonBase-root').contains('Manager').click()
 cy.get('[href="/services/new"]').should('exist').click()
 cy.get('#service-total').should('exist')
 cy.get('.tags-selector > :nth-child(2) > .MuiButtonBase-root').click()
 cy.get('.items-wrapper > :nth-child(1) > .MuiButtonBase-root').click()
 cy.get('.items-wrapper > :nth-child(9) > .MuiButtonBase-root').click()
 cy.get('#service-next-btn').click()
})
}) 