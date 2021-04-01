import listings from '/tests/cypress/fixtures/listings'
const address = listings.easy.address
import users from '/tests/cypress/fixtures/users.json'

describe('Create property', () => {
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

  describe('navigates to the properties page as a customer and views the details of a listing', () => {
    it('navigates to the properties page', () => {
      cy.visit('/properties')
      login(users.customer.username, users.customer.password)

      cy.get('.address')
        .contains('1 Easy St, Nirvana VIC 3999, Australia')
        .should('exist')
        .click()
      cy.get('[data-cy="next-step-0"]').should('exist')
    })
  })
})
