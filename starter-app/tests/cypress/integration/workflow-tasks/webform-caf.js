import 'cypress-fill-command'
import users from '/tests/cypress/fixtures/users.json'
import listings from '/tests/cypress/fixtures/listings'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are    using
  return false
})

describe('adds a property from the landing page (new user)', () => {
  before(function () {
    freshDatabase()
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('cleanup.listing', listings.easy.address)
    })
    cy.wait(4000)
  })
  it('Adds a property and completes the Customer authorisation form', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.window().then(async (win) => {
      listings.easy.slug = 'test-caf'
      const response = await win.Meteor.callAsync('launch.job', listings.easy)
      console.log(response)
    })
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('h3')
      .contains(/^To do/)
      .should('exist')
    cy.get('.address')
      .contains(/^1 Easy St/)
      .should('exist')
      .click()
    cy.get('div.MuiCardHeader-root').contains('CAF Webform').should('exist')
    cy.get('button#start-form').contains('Start form').should('exist').click()
    cy.get('button#start-webform').should('exist').click()

    // STEP 1 - PRIVACY
    cy.get('button[type="submit"]').contains('Next').click()

    // STEP 2 - CLIENT DETAILS
    cy.get('input#client-name').should('have.attr', 'value', users.customer.name)
    cy.get('input#client-name').clear().fill(users.customer.name)
    // Click next too early...
    cy.get('button[type="submit"]').contains('Next').last().click()
    // Check  that we get an error
    cy.get('p').contains('Current address is required').should('exist')
    // Satisfy it now
    cy.get('input#google-places-search').clear().fill('On the road to nowhere')
    cy.get('button[type="submit"]').contains('Next').click()

    // STEP 3 - TRANSACTION DETAILS
    cy.get('[name="authority"][value="standing"]').click()
    cy.get('button[type="submit"]').contains('Next').click()

    // STEP 4 - CONVEYANCING TRANSACTION(S)
    cy.get('#land-titleref').clear().fill('00000/000')
    cy.get('input#transaction-mortgage').click({ force: true })
    cy.get('button[type="submit"]').contains('Next').click()

    // PREVIEW
    cy.get('button#preview').contains('Preview').click()
    cy.get('button#sign').contains('Sign').click()
    cy.get('button#complete-step').click()
    // Wait for confirmation of the step being completed
    cy.get('div.MuiCardHeader-root').contains('CAF Webform').should('exist')
  })
  it('PM Approves the web form', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.pm.username, users.pm.password)
    cy.wait(500)
    cy.get('h1').contains('My properties').should('exist')
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('h3')
      .contains(/^To do/)
      .should('exist')
    cy.get('.address')
      .contains(/^1 Easy St/)
      .should('exist')
      .click()
    cy.get('div.MuiCardHeader-root')
      .contains('Approve Customer authorisation')
      .should('exist')
    cy.get('button#start-form').contains('Review and approve').should('exist').click()
    cy.get('button#start-webform').should('exist').click()
    // STEP 1 - PRIVACY
    cy.get('button[type="submit"]').contains('Next').click()
    // STEP 2 - CLIENT DETAILS
    cy.get('button[type="submit"]').last().click()
    // STEP 3 - TRANSACTION DETAILS
    cy.get('button[type="submit"]').last().click()
    // STEP 4 - CONVEYANCING TRANSACTION
    cy.get('button[type="submit"]').last().click()
    // PREVIEW
    cy.get('button#preview').contains('Preview').click()
    cy.get('button#sign').contains('Sign').click()
    cy.get('button#complete-step').click()
    cy.get('a[href="/properties"]').should('exist')
    // Wait for confirmation of the step being completed
    cy.get('div.MuiCardHeader-root')
      .contains('Approve Customer authorisation')
      .should('exist')
  })

  it('Completes the "Finished" task', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.wait(400)
    cy.get('h1').contains('My properties').should('exist')
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('h3')
      .contains(/^To do/)
      .should('exist')
    cy.get('.address')
      .contains(/^1 Easy St/)
      .should('exist')
      .click()
    cy.get('div.MuiCardHeader-root').contains('Finished').should('exist')
    cy.get('button#checklist').should('exist').click()
    cy.get('h1').contains('Finished').should('exist')
    cy.get('input#done').should('exist').click()
    cy.get('button#complete').should('exist').click()
    // Wait for confirmation of the step being completed
    cy.get('div.MuiCardHeader-root').contains('Finished').should('exist')
  })
})
