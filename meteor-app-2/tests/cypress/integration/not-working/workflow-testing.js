Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('add workflow', function () {
  it('logs into admin tool', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type('super.mario@mario.com')
    cy.get('[data-cy=password-input] > .MuiInputBase-root > .MuiInputBase-input')
      .clear()
      .type('i-like-turTles-27')

    cy.get('[data-cy=login-btn]').click()

    cy.get(['data-cy=admn-drawer']).click()

    cy.get('div[class=pro-inner-item]').contains('Hacks').click()

    cy.get('div[class=pro-inner-item]').contains('Workflows').click()

    cy.get('.tabulator-table > :nth-child(6) > :nth-child(3)').click()

    cy.get('#search').type('Stage 2')
    cy.get(' .rst__nodeContent').contains('Notification').click()

    cy.get('input[name=name]').clear().type('Notified')
    cy.get('input[name=slug]').clear().type('notified')

    cy.get('.react-tags__selected > :nth-child(2)').contains('Sign').click()

    cy.get(' .rst__toolbarButton').contains('Stage 2').click()
    cy.get(' .rst__nodeContent').contains('Next Stage').click()

    cy.get(' .rst__nodeContent').contains('Notification').click()

    cy.get('input[name=name]').clear().type('Notification')
    cy.get('input[name=slug]').clear().type('notification')

    cy.get(' .react-tags__search-input').click().type('Sign')
    cy.get('#ReactTags-0').contains('Sign').click()

    cy.get('button').contains('Save').should('be.enabled').click()
  })
})
