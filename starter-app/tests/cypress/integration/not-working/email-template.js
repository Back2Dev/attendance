Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Create member', function () {
  it('logs into the website', function () {
    cy.visit('/login')
    // cy.click('admin')
    //  login('super.admin@convx.co ', 'pinapple1Q!')
    // cy.visit('/admin/messages')
    cy.get(
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input'
    )
      .clear()
      .type('geronimo.yawns@test.com')
    cy.get(
      ':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input'
    )
      .clear()
      .type('me2')

    cy.get(':nth-child(4) > .MuiButtonBase-root').contains('Sign in').click()

    cy.get('[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root').should('exist').click()

    cy.get('[data-cy=switch-role]').click()

    cy.get('[value="ADM"]').last().click()

    cy.get(
      '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click()

    cy.get('.makeStyles-sideDrawer-61 > :nth-child(2)')
      .contains('Hacks')
      .click()

      cy.get('[href="/hacks/transporter"] > .MuiButtonBase-root')
      .contains('Messages')
      .click()

      cy.get('.MuiTypography-h2').contains('Messages Transporter').should('exist')

    cy.get(
      ':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #message-search'
    ).click()
    cy.get('#message-search-option-1').should('exist').click()

    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root').click()

    cy.get('#message-search-option-0').click()

    cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .MuiTypography-root').contains('Subject: new-user').should('exist')

     cy.get('[name="nickname"]').should('exist').type('Greck')

    cy.get('[name=recipient]').click().type('fredgugurle')

    cy.get('[name="role"]').clear().type('Manager')

    cy.get('[name=email]').click().type('fred@gurgurle.co.111')

    cy.get('[name=timestamp]').click().type('12:00:00')

    cy.get('form > .MuiButtonBase-root').click()

   cy.get('.MuiCardActions-root > .MuiButtonBase-root').click()
  })
})
