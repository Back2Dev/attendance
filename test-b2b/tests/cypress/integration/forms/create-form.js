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

  it('navigates to Back2bikes homepage logs in and switches role to admin', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(this.users.mike.username)
    cy.get('[data-cy=password-input]').type(this.users.mike.password)
    cy.get('[data-cy=login-btn]').should('exist').click()
    cy.get('[data-cy=member-portal]').should('exist')

    cy.get(
      '[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root > .MuiSvgIcon-root'
    ).click()

    cy.get('[data-cy=switch-role]').click()
    cy.get('[value="ADM"]').last().click()

    //opens  manager menu navigates to create service page and adds minor service', function () {
    cy.get('[data-cy=adm-drawer]').click()
    cy.get('[data-cy=admin]').click()
    cy.get('[href="/admin/forms"]').eq(1).should('exist').click()
    cy.get('#add').click()
    cy.get('[name=name]').clear().type('Test Incident Report')
    cy.get('[name=slug]').clear().type('test-101')
    cy.get('[name=source]').clear().type(`
    S General
    +id = incident-report-general
    
    Q Entered by:
    +type=text
    +id=entered-by
    A Name(will be logged in user)
    `)
    cy.get('[name=revision]').clear().type('1')
    cy.get('[name=active]').click()
    cy.get('button[type=submit]').click()
    cy.visit('/admin/forms/edit/test-101')
    cy.get('.editorTools > span > button:nth-child(2)').click()
  })

  it('tests recently created form', () => {
    cy.get('#entered-by-name-will-be-logged-in-user-').should('exist').type('Some one')
    cy.get('[data-cy=next-step]').click()
  })
})
