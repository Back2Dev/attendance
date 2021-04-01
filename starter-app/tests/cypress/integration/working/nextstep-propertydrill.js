import listings from '/tests/cypress/fixtures/listings'
const address = listings.easy.address
import users from '/tests/cypress/fixtures/users.json'

describe('loads the database with a property', () => {
  before(function () {
    freshDatabase()
  })
  beforeEach(function () {
    cy.visit('/')
    cy.window().then(async (win) => {
      listings.easy.slug = 'vic-buy'
      const response = await win.Meteor.callAsync('launch.job', listings.easy)
    })
  })
  it('navigates to the landing page and logs in', () => {
    cy.visit('/properties')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('a[href="/properties"]').should('exist') // wait for page to load
    cy.get('.address > .MuiTypography-root')
      .contains(listings.easy.address)
      .should('exist')
      .click()

    cy.get('[data-cy=upload-cos]').should('exist').should('be.enabled')
  })
})
