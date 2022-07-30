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
  it('logs in from hompage', () => {
    cy.visit('/admin/forms')
    cy.loginFromHomepage('mike.king@mydomain.com.au', 'me2')
    cy.visit('/admin/forms')
    cy.getSettled('#add').click()
    cy.get('[name=name]').clear().type('Test Incident Report')
    cy.get('[name=slug]').clear().type('test-101')
    cy.get('[name=source]').clear().type(`
    S Input Types 2
    +id = input-types-2
  

    Q Multiple
    +type=multiple
    A select me
    A No select me
    A Pls select me

    Q Dropdown
    +type=dropdown
    A 1
    A 2 
    A 3
   
    `)
    cy.get('[name=revision]').clear().type('1')
    cy.get('[name=active]').click()
    cy.get('button[type=submit]').click()
    cy.visit('/admin/forms/edit/test-101')
    cy.get('.editorTools > span > button:nth-child(2)').click()
    // check with missing inputs
    cy.get('[data-cy=next-step]').click()

    // cy.get('[data-cy=next-step]').should('exist').click()

    // cy.get('[data-cy=completed]').should('exist')
  })
})
