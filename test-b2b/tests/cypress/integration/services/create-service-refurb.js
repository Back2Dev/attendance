Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('log into app and create a service for refurbishment', () => {
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
    cy.get('.makeStyles-sideDrawer-67 > :nth-child(4) > .MuiButtonBase-root')
      .contains('Manager')
      .click()
    cy.get('[href="/services/new"]').should('exist').click()
    cy.get('#service-total').should('exist')
    cy.get('[data-cy=minor]').click()
    cy.get('.items-wrapper > :nth-child(1) > .MuiButtonBase-root').click()
    //  cy.get('.items-wrapper > :nth-child(9) > .MuiButtonBase-root').click()
    cy.get('#service-next-btn').click()

    cy.get('[name="assessor"]').clear().type('Super Mario')
    cy.get('[name="bikeName"]').clear().type('Giganto')
    cy.get('[name="dropoffDate"]').clear().type('2022-01-19')
    cy.get('[name="pickupDate"]').clear().type('2022-02-01')
    cy.get('[name="replacementBike"]').clear().type('N/A')
    cy.get('[name="budget"]').clear().type('199')

    cy.get('[name="note"]').clear().type('no replacement bike required')

    cy.get('[data-cy="next"').click()

    cy.get('.refurbish-btn').click()
    cy.get('#service-total').should('exist')
    cy.wait(100) // Give the dispatcher a moment
    cy.get('[data-cy=submit]').should('exist').click()

    cy.get('.jobs-header > .MuiTypography-root').should('exist')
    cy.get('.rdg-row > [aria-colindex="4"]').contains('Giganto').should('exist')
    //  cy.get('.new-member-btn').click()
    //  cy.get('[name="name"]').clear().type('Pat Carmel')
    // cy.get('[name="mobile"]').clear().type('12')
    // cy.get('[name="email"]').clear().type('mario.super@gurgle.111')

    // cy.get('.jobs-header > .MuiTypography-root').should('exist')
    // cy.get('.rdg-row > [aria-colindex="5"]').contains('Pat Carmel').should('exist')
    // cy.get('.rdg-row > [aria-colindex="4"]').contains('Giganto').should('exist')
  })
})
