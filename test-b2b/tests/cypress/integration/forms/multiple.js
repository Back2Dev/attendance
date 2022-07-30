Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('log into app and create a form with a multiple question', () => {
  before(function () {
    cy.visit('/')
    freshDatabase()
  })

  it('logs in from home page', () => {
    adminLogin('mike.king@mydomain.com.au', 'me2')
    cy.wait(2000)
    cy.visit('/admin/forms')
    cy.getSettled('#add').click()
    cy.get('[name=name]').clear().type('Test Multiple')
    cy.get('[name=slug]').clear().type('test-multiple')
    cy.get('[name=source]').clear().type(`
    S Part 1
    +id=part1
    
    Q Which sports do you play?
    +type=multiple
    +id=play
    +optional=1
    A Golf
    A Soccer
    A Tennis
    A Footy
    A Squash
    A Croquet
    A Lawn bowls
    A Trugo
    A Curling
#    A Skiing

    S Part 2
    +id=part2

    Q Which sports do you watch?
    +type=multiple
    +id=watch
    // +optional=1
    A Golf
    A Soccer
    A Tennis
    A Footy
    A Squash
    A Croquet
    A Lawn bowls
    A Trugo
    A Curling
    A Skiing
    `)
    cy.get('[name=revision]').clear().type('1')
    cy.get('[name=active]').click()
    cy.get('button[type=submit]').click()
    cy.visit('/admin/forms/edit/test-multiple')
    // Compile and run the form...
    cy.get('[data-cy="run-form"]').click()

    // check with missing inputs - first question is optional, so that's ok
    cy.get('[data-cy=next-step]').click()

    // check with missing inputs - second question needs all of them checked
    cy.get('[data-cy=next-step]').last().click()
    cy.get('[data-cy=next-step]').last().should('be.disabled')

    const sports =
      'golf soccer tennis footy squash croquet lawn-bowls trugo curling skiing'.split(
        /\s+/
      )
    sports.forEach((key) => {
      cy.get(`input[value="watch-${key}"]`).check()
    })
    cy.get('[data-cy=next-step]').last().should('be.enabled').click()

    cy.get('[data-cy=completed]').should('exist')
  })
})
