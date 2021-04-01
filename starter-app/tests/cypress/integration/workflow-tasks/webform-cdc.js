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
  it('Adds a property and completes the Cost disclosure form', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.window().then(async (win) => {
      listings.easy.slug = 'test-cdc'
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
    cy.get('div.MuiCardHeader-root').contains('CDC Webform').should('exist')
    cy.get('button#start-form').contains('Start form').should('exist').click()
    cy.get('button#start-webform').should('exist').click()
    // STEP 1 - PRACTICE DETAILS
    cy.get('input#practice-name').should('have.value', 'Settle Easy VIC')
    cy.get('button[type="submit"]').contains('Next').last().click()
    // STEP 2 - CUSTOMER
    cy.get('input#customer-email').should('have.value', 'charlie.customer@test.com')
    cy.get('input#customer-email').click().blur()
    // Click next too early...
    cy.get('button[type="submit"]').contains('Next').last().click()
    // Check  that we get an error
    cy.get('p').contains('Residential address is required').should('exist')
    // Satisfy it now
    cy.get('input#google-places-search').clear().type('On the road to nowhere')
    cy.get('button[type="submit"]').contains('Next').last().click()
    // STEP 3 - VOLUME AND FOLIO
    cy.get('input#certificate-volume').clear().type('00000')
    cy.get('input#certificate-folio').clear().type('000')
    cy.get('button[type="submit"]').contains('Next').last().click()
    // STEP 4 - COST AND INVOICE
    cy.get('input#invoice-cost').clear().type('660')
    cy.get('input#invoice-disbursements').clear().type('500')
    cy.get('button[type="submit"]').contains('Next').last().click()
    // PREVIEW
    cy.get('button#preview').contains('Preview').click()
    cy.get('button#sign').contains('Sign').click()
    cy.get('button#complete-step').click()
    // Wait for confirmation of the step being completed
    cy.get('div.MuiCardHeader-root').contains('CDC Webform').should('exist')
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
    cy.get('div.MuiCardHeader-root').contains('Approve Cost disclosure').should('exist')
    cy.get('button#start-form').contains('Review and approve').should('exist').click()
    cy.get('button#start-webform').should('exist').click()
    // STEP 1 - PRACTICE DETAILS
    cy.get('input#practice-name').should('have.value', 'Settle Easy VIC')
    cy.get('button[type="submit"]').contains('Next').last().click()
    // STEP 2 - CUSTOMER
    cy.get('input#customer-email').should('have.value', 'charlie.customer@test.com')
    cy.get('button[type="submit"]').last().click()
    // STEP 3 - VOLUME AND FOLIO
    cy.get('input#certificate-volume').should('have.value', '00000')
    cy.get('button[type="submit"]').last().click()
    // STEP 4 - COST AND INVOICE
    cy.get('input#invoice-cost').should('have.value', '660')
    cy.get('button[type="submit"]').last().click()
    // PREVIEW
    cy.get('button#preview').contains('Preview').click()
    cy.get('button#sign').contains('Sign').click()
    cy.get('button#complete-step').click()
    // Wait for confirmation of the step being completed
    cy.get('div.MuiCardHeader-root').contains('Approve Cost disclosure').should('exist')
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
