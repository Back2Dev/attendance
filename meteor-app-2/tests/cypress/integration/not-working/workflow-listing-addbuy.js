Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('add a listing through the addbuy button', () => {
  it('logs into the admin tools app and navigates to the listings page', () => {
    login(users.admin.username, users.admin.password)
    cy.visit('/admin/listings')
    cy.get('#validationCustom01').should('exist').clear().type('super.admin@convx.co')
    cy.get('#formBasicPassword').should('exist').clear().type('me2')
    cy.get('.btn, .btn-primary').should('be.enabled').click()
    cy.get('.pro-inner-item').should('exist').contains('Hacks').click()
    cy.get('.pro-inner-item').should('exist').contains('Listings').click()

    // clicks on the #addbuy button
    // and goes through steps for adding a listing under buying category

    // this  line doesn't work
    // cy.get('#addbuy').click({ force: true })

    //it goes through and adds the information in the next steps page
    cy.get('.tabulator-row-even > :nth-child(3) >.fa').should('exist').click()

    //tyring to make code to check if it is on the right page
    //cy.get('h5').contains('Contract', ' - Next Steps')

    cy.get(
      '#stages-tabpane-contract > .page-wrapper > .card > .card-body > .next-step-section > .table > tbody > :nth-child(1) > :nth-child(3) > .mobile-flex > .btn'
    )
      .should('be.enabled')
      .click()
    cy.get('.rbt-input-main, .rbt-main-form-control').type('super admin')
  })
})
