import listings from '/tests/cypress/fixtures/listings'
Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('Assigns a conveyancer', () => {
  before(function () {
    freshDatabase()
    cy.window().then(async (win) => {
      listings.buy.slug = 'vic-buy'
      await win.Meteor.callAsync('launch.job', listings.buy)
    })
    cy.fixture('users').then(function (users) {
      this.users = users
    })
  })

  it('Assigns a conveyancer', function () {
    cy.visit('/properties')
    login(this.users.pm.username, this.users.pm.password)
    cy.get('.address > .MuiTypography-root').click()
    cy.get('#assign-btn').should('be.enabled').click()
    cy.get('#conveyancer-select')
      .type(this.users.conveyancer.name)
      .type('{downarrow}')
      .type('{enter}')
    cy.get('#assign-con-btn').should('be.enabled').click()
    cy.get('#assign-btn').should('contain', 'Reassign')
  })
})
