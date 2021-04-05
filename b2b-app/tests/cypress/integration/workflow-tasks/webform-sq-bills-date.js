import 'cypress-fill-command'
import users from '/tests/cypress/fixtures/users.json'
import listings from '/tests/cypress/fixtures/listings'
const address = listings.easy.address

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are    using
  return false
})

describe('Sellers questionnaire web form (mini-workflow)', () => {
  before(function () {
    freshDatabase()
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('cleanup.listing', listings.easy.address)
    })
    cy.wait(4000)
  })
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  })
  it('Adds a property and completes the seller questionnaire', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.customer.username, users.customer.password)
    cy.window().then(async (win) => {
      listings.easy.slug = 'test-sq'
      const response = await win.Meteor.callAsync('launch.job', listings.easy)
    })
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('button#seller-q').should('exist').click()
    cy.get('#start-webform').should('be.enabled').click()
    cy.get('[value=individual]').click()
    cy.get('#individual-name').clear().type(users.existingCustomer.name)
    cy.get('#individual-email').clear().type(users.existingCustomer.username)
    cy.get('#individual-mobile').clear().type(users.existingCustomer.phone)
    cy.get('input[name=individual-residential]')
      .clear()
      .type(address)
      .blur()
      .should('have.attr', 'value', address)
    cy.get('input[name=individual-postal]')
      .clear()
      .type(address)
      .blur()
      .should('have.attr', 'value', address)

    cy.WebformPressNext()

    // Skip to bills section
    cy.get('[data-cy=step-bills]').click()

    // STEP 11 BILLS
    cy.get('#bills-water').type('2021-06-01')
    cy.get('#bills-rates').type('2021-06-01')
    cy.get('#bills-landtax').type('2021-06-01')
    cy.get('#bills-ownerscorp').type('2021-06-01')
    cy.get(`[name="haveOwnersCorp"][value="1"]`).click()
    cy.get('#ownersCorp-manager').fill('Jan I Tor')
    cy.get('[name=ownersCorp-address]').clear().fill('1 Owners St, Corpville KY 22222')
    cy.WebformPressNext()

    // STEP 12 OUTGOINGS
    cy.get('#outgoings-council').click()
    cy.get('#outgoings-water').click()
    cy.WebformPressNext()

    // TEST ENDS HERE (A BIT INCONCLUSIVE, BUT IT TARGETED A PROBLEM WHICH IS NOW FIXED)
  })
})
