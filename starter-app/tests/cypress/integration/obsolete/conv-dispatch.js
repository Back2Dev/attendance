import users from '../../fixtures/users.json'
/*
 * Status: This test is superceded
 */

Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

// This is a PM dispatch test for now but should test for conveyancer dispatch too

const address = 'MCG, Brunton Avenue, Richmond VIC, Australia'
const transactionType = 'buy'
const settlementDate = '21/12/2099'
const referral = 'Barry Plant'
const cost = 660
const invitedCustomer = {
  name: 'Fake Person',
  email: 'fake.person@mydomain.com.au',
  mobile: '+61412345678',
}

describe('Goes through PM Dispatch Workflow', () => {
  before(function () {
    freshDatabase()
    // dont use UI to log in
    // https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-In
  })

  it('Adds a buy property as a customer', () => {
    login(users.customer.username, users.customer.password)
    cy.get('#properties-nav-item').click()
    cy.get('h1').contains('My properties')
    cy.get('[data-cy=add-btn]').click()
    cy.get('#google-places-search').type(address).blur()
    cy.get(`input[value="${transactionType}"]`).first().check()
    cy.get('[data-cy=botp-fields]').within(() => {
      cy.get('input[value="yes"]').should('exist')
      cy.get('input[value="no"]').check()
    })
    cy.get('[data-cy=addproperty-submit').click()
    cy.get('[data-cy=notifications-bell]').click()
    cy.get('.message-container').within(() => {
      cy.get('.message').contains(
        `You have added a new property with address: ${address}`
      )
    })
    logout()
  })

  it('PM goes through the PM dispatch workflow', () => {
    cy.visit('/')
    login(users.pm.username, users.pm.password)
    cy.get('.notifications').click()
    cy.get('.message-container').within(() => {
      cy.get('.message')
        .contains(`geronimo.yawns@test.com has just added a property: ${address}`)
        .click()
    })
    // This checks if clicking the notification works, then we check if it's in my properties
    cy.get('h3').should('contain', 'Possible duplicates')
    cy.get('#properties-nav-item').click()
    cy.get('[data-cy=new-properties]').within(() => {
      cy.get('.address').should('have.length', 1).should('contain', address).click()
    })
    // duplicates
    cy.get('h3').should('contain', 'Possible duplicates')
    cy.get('[data-cy=no-duplicates-message').should('exist')
    cy.get('[data-cy=dispatch-next  ]').click()
    // edit info
    cy.get('h3').should('contain', 'Add/Edit information')
    cy.get('input[name="address"]').should('have.value', address)
    cy.get('input[id="settlement-date-picker"]').type(settlementDate)
    cy.get('input[name="referralSource"]').type(referral)
    cy.get('input[id="cost-adorment-cost"]').type(cost)
    cy.get('[data-cy=dispatch-next]').click()
    // add participants
    cy.get('#role-select').type('Conveyancer').type('{downarrow}').type('{enter}')
    // This user should be typing name but there's something wrong with fixtures
    cy.get('#user-select')
      .type(users.conveyancer.username)
      .type('{downarrow}')
      .type('{enter}')
    cy.get('[data-cy=add-person-submit]').click()
    cy.get('#role-select').type('Customer').type('{downarrow}').type('{enter}')
    cy.get('#user-select').type(invitedCustomer.name).type('{downarrow}').type('{enter}')
    cy.get('[data-cy=add-person-submit]').wait(200).click()
    // There should be 3 people
    cy.get('.tabulator-row').should('have.length', 3)
    cy.get('[data-cy=dispatch-next]').click()
    // Contract upload
    cy.get('[data-cy=dispatch-next]').click()
    // Review page
    cy.get('h3').should('contain', 'Review')
    cy.get('[data-cy=address]').contains(address)
    cy.get('[data-cy=transaction-type]').contains(transactionType)
    cy.get('[data-cy=settlement-date]').contains(settlementDate)
    cy.get('[data-cy=referral-source]').contains(referral)
    cy.get('[data-cy=cost]').contains(cost)
    cy.get('[data-cy=participants]').within(() => {
      cy.contains(users.customer.username)
      cy.contains(users.conveyancer.username)
      cy.contains(invitedCustomer.name)
    })
    cy.get('[data-cy=launch-job]').click()
    cy.get('#assign-btn').should('contain', 'Reassign')
  })
})
