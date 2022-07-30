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
    A Email
    +type=email
    A Long answer
    +type=long
    A Number
    +type=num
    A Address 
    +type=address
    A Mobile number
    +type=mobile
    A Date
    +type=date
    A Password
    +type=password
    `)
    cy.get('[name=revision]').clear().type('1')
    cy.get('[name=active]').click()
    cy.get('button[type=submit]').click()
    cy.visit('/admin/forms/edit/test-101')
    cy.get('.editorTools > span > button:nth-child(2)').click()
    // check with missing inputs
    cy.get('[data-cy=next-step]').click()
    cy.get('p#entered-by-name-will-be-logged-in-user-').should('exist')
    cy.get('p#entered-by-email').should('exist')
    cy.get('p#entered-by-long-answer').should('exist')
    cy.get('p#entered-by-number').should('exist')
    cy.get('p#entered-by-address').should('exist')
    cy.get('p#entered-by-mobile-number').should('exist')
    cy.get('p#entered-by-date').should('exist')
    cy.get('p#entered-by-password').should('exist')
    // check disabled button
    cy.get('[data-cy=next-step]').should('be.disabled')

    // give a proper Text
    cy.get('#entered-by-name-will-be-logged-in-user-').should('exist').type('Some one')
    cy.get('p#entered-by-name-will-be-logged-in-user-').should('not.exist')

    // check invalid email
    cy.get('input#entered-by-email').type('some')
    cy.get('[data-cy=next-step]').should('be.disabled')
    cy.get('p#entered-by-email').should('exist')
    // give a proper email
    cy.get('input#entered-by-email').clear().type('some@email.com')
    cy.get('p#entered-by-email').should('not.exist')
    // give proper long answer
    cy.get('textarea#entered-by-long-answer').type('This is long answer')
    // cy.get('[data-cy=completed]').should('exist')
  })
})
