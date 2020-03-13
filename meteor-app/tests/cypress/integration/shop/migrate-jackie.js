import dude from '../../support/test-data-jackie-chan'

describe('Create a Jackie Chan', function() {
  it(`Creates a Jackie`, function() {
    cy.visit('/')
    addJackie()
  })
})

describe('Migrate Jackie', function() {
  it('Migrates pass member', function() {
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
  })
})

describe('Reset Jackie Chan', function() {
  it('Creates a Jackie', function() {
    cy.visit('/')
    addJackie()
  })
})
