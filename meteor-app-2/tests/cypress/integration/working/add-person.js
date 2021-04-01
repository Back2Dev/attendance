import users from '/tests/cypress/fixtures/users.json'
import listings from '/tests/cypress/fixtures/listings'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('adds a person to the listing', function () {
  before(function () {
    freshDatabase()
    cy.window().then(async (win) => {
      listings.easy.slug = 'test-cdc'
      await win.Meteor.callAsync('launch.job', listings.easy)
    })
  })
  it('logins into the platform and goes to the admin/listing page', () => {
    cy.loginFromHomepage(users.admin.username, users.admin.password)
    cy.get('[data-cy=adm-drawer]').click()
    cy.get('div')
      .contains(/^Admin$/)
      .click()
    cy.get('div').contains('Listings').click()

    cy.get('#search').clear().type('1 Easy St')

    cy.get('.formatterCell > .MuiSvgIcon-root').click()

    cy.get('.MuiTabs-flexContainer > :nth-child(4)').contains('Persons').click()
    cy.get('.MuiButton-root, .MutliButton-contained')
      .contains('Add Person')
      .should('exist')
      .click()

    cy.get('#role-select').type('Agent').type('{downarrow}').type('{enter}')
    cy.get('#user-select').type('Agent').type('{downarrow}').type('{enter}')
    cy.get('[data-cy=add-person-submit]').click()
    cy.get('.MuiTableBody-root').should('contain', 'AGT')
  })
})
