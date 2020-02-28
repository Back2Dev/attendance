import dude from '../../support/test-data-bruce-lee'

describe('Create a Bruce Lee', function() {
  it(`Creates a Bruce`, function() {
    cy.visit('/')
    addBruce()
  })
})

describe('Migrate Bruce', function() {
  it('Migrates', function() {
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
