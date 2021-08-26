Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('opens the new platform and tests the google login function', () => {
  before(function () {
    freshDatabase()
  })

  it('navigates to  startup inc homepage and enters information and clicks sign in', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(this.users.admin.username)
    cy.get('[data-cy=password-input]').type(this.users.admin.password)
    cy.get('[data-cy=login-btn]').click()

    cy.get('[data-cy=primary-search-account-menu] .MuiAvatar-root')
      .should('exist')
      .click()
    cy.get('[data-cy="switch-role"]').click()
    cy.get(' #primary-search-account-menu [value="ADM"]').click()
    cy.get('[data-cy=adm-drawer]').should('exist').click()
    cy.get(':nth-child(4) > [data-cy=manager]').should('exist').click()
    cy.get('[href="/services"]').should('exist').click()
    cy.get('[data-cy="create-job"]').should('be.enabled').click()
    cy.get('[data-cy="item-select"]').type('tyre')
    cy.get('[data-option-index="2"]').contains('Rear Tyre').click()
    cy.wait(100)
    cy.get('[data-cy="item-select"]').type('bell')
    cy.get('[data-option-index="0"]').click()
    cy.get('[data-cy="item-select"]').type('tube')
    cy.get('[data-option-index="0"]').click()
    cy.get('[data-cy="assessor"]').type('Pat Carmel')
    cy.get('[data-cy="next-btn"]').should('be.enabled').click()
    cy.get('#bookings-nav-item').should('exist')
    cy.get('[name="make"]').type('Giant')
    cy.get('[name="model"]').type('Mammoth')
    cy.get('[name="color"]').type('grey')
    cy.get('[name="type"]').type('Mountain')
    cy.get('[name="budget"]').type('299').blur({ force: true })
    cy.wait(100)
    cy.get('[data-cy=submit]').should('be.enabled').click()
    cy.get('#bookings-nav-item').should('exist')
    cy.get('[name="name"]').type('Test User')
    cy.get('[name="mobile"]').type('0403582542')
    cy.get('[name="email"]').type('pato@live.com.au')
    cy.get('[data-cy=submit-contact]').should('be.enabled').click()
    cy.get('#bookings-nav-item').should('exist')
    cy.get('[name="dropOffDate"]').type('2022-01-20').blur()
    cy.get('[name="pickupDate"]').type('2022-02-21').blur()

    cy.get('[name="replacementBike"]').type('NO')
    cy.get('[data-cy="submit-pickup"]').should('be.enabled').click()
  })
})
