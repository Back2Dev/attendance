import dude from '../../support/test-data-eddie-mercx'

const numSessions = dude.member.sessionCount

describe('Create an Eddie Mercx', function() {
  it('Creates an Eddie', function() {
    cy.visit('/')
    addEddie()
  })
})

describe('Migrate Eddie', function() {
  it('Migrates casual member with no current purchases', function() {
    cy.visit(`/admin/userprofiles/${dude.member._id}`)
    cy.get('input[name=email]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name=password]')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

    cy.contains('Merge').click()
    cy.get('#numPurchases').contains(numSessions)
    cy.get('.content').contains(numSessions + ' items')
  })
})

describe('Reset Eddie Mercx', function() {
  it('Creates an Eddie', function() {
    cy.visit('/')
    addEddie()
  })
})
