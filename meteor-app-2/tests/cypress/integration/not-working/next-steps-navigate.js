describe('approves a document on the next steps page', () => {
  it(
    'naviagtes to the next steps page, skips steps and checks whether the right' +
      'amount of tasks are showing',
    () => {
      // cy.visit('/login')

      cy.get('button[class = "tabulator-page]"')
        .contains('Last')
        .should('be.enabled')
        .click()

      cy.get('#login-nav-item').contains('Log in').click()
      cy.get(
        ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input'
      )
        .clear()
        .type('super.admin@convx.co')
      cy.get(
        ':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input'
      )
        .clear()
        .type('pineapple1Q!')
      cy.get(':nth-child(4) > .MuiButtonBase-root')
        // .contains('Sign in')
        .should('be.enabled')
        .click()

      cy.get(
        '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root'
      ).click()
      cy.get('.makeStyles-sideDrawer-53 > :nth-child(3) > .MuiButtonBase-root')
        .contains('Admin')
        .click()
      cy.get('[href="/admin/listings"] > .MuiButtonBase-root').click()

      cy.get(':nth-child(5) > [tabulator-field="address"]')
        .contains('20 Next street')
        .should('exist')
    }
  )
})
