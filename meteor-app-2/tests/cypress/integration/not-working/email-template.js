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
      .type('super.mnario@mario.com')
    cy.get(
      ':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input'
    )
      .clear()
      .type('me2')

    cy.get(':nth-child(4) > .MuiButtonBase-root').contains('Sign in').click()

    cy.get(
      '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click()

    cy.get('.makeStyles-sideDrawer-41 > :nth-child(2) > .MuiButtonBase-root')
      .contains('Hacks')
      .click()

    cy.get('[href="/hacks/transporter"] > .MuiButtonBase-root')
      .contains('Messages')
      .click()

    cy.get('.MuiTypography-h2').contains('Messages Transporter').should('exist')

    cy.get(
      ':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #message-search'
    ).click()
    cy.get('#message-search-option-1').click()

    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root').click()
    cy.get('#select-email').click()

    cy.get('a').contains('contact-us').click()

    cy.get('div').contains('Name: *|name|*').should('exist')

    cy.get('[name=recipient]').click().type('Greg')

    cy.get('[name=name]').click().type('Simon')

    cy.get('[name=email]').click().type('fred@gurgurle.co.111')

    cy.get('[name=phoneNumber]').click().type('12')

    cy.get(':nth-child(6) > .btn').click()

    cy.get('div[class=disabled]').contains('Message is required').should('exist')
  })
})
