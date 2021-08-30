Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('opens the new platform and tests the calendar, booking and calendar systems', () => {
  before(function () {
    freshDatabase()
  })

  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  })

  it('navigates to  calendar page through the admin menu and creates an event', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type('broderick.larkin@testa.rossa')
    cy.get('[data-cy=password-input]').type('me2')
    cy.get('[data-cy=login-btn]').click()

    cy.get('[data-cy=primary-search-account-menu] .MuiAvatar-root')
      .should('exist')
      .click()
    cy.get('[data-cy="switch-role"]').click()
    cy.get(' #primary-search-account-menu [value="ADM"]').click()
    cy.get('[data-cy=adm-drawer]').should('exist').click()
    cy.get(':nth-child(3) > [data-cy=manager]').should('exist').click()
    cy.get('[href="/admin/calendar"]').should('exist').click()
    cy.get('[data-date="2021-08-26"]').should('exist').click()

    cy.get('[name="name"]').type('Womens Night 2')
    cy.get(
      ':nth-child(4) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    ).type("Trav's triangle/beginner")
    cy.get('[data-option-index="0"]').click()
    cy.get('[name="location"]').type('Back2Bikes')
    cy.get(
      ':nth-child(5) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    ).type('St Kilda cruise/intermediate')
    cy.get('[data-option-index="0"]').click()
    cy.get('[name="when"]').type('2022-02-21T08:00').blur()
    // this code is broken its the id for repeat event in form.js for the event creator
    // cy.get('[type="checkbox"]').click()
    cy.get('[name="duration"]').type('2')
    cy.get('[name="price"]').type('{ctrl}').type('{leftarrow}').type('1000')
    cy.get('[data-cy="submit-event"]').should('be.enabled').click()
  })
  // adds users to the booking
  it('log in as herminio blick and book to join new event ', () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type('herminio.blick@testa.rossa')
    cy.get('[data-cy=password-input]').type('me2')
    cy.get('[data-cy=login-btn]').click()
    cy.get('#bookings-nav-item').should('exist')
    cy.get('[data-cy=book-event]').should('be.enabled').click()
    cy.get('.right-col > .MuiButtonBase-root').click()
    cy.get('#dashboard-nav-item').click()
    cy.get('.session-info')
      .contains("Mon 21 Feb 8 AM, Womens Night 2: Trav's Triangle")
      .should('exist')
  })
  it('log in as dorothea kovacek and book to join new event ', () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type('dorothea.kovacek@testa.rossa')
    cy.get('[data-cy=password-input]').type('me2')
    cy.get('[data-cy=login-btn]').click()
    cy.get('#bookings-nav-item').should('exist')
    cy.get('[data-cy=book-event]').should('be.enabled').click()
    cy.get('.right-col > .MuiButtonBase-root').click()
    cy.get('#dashboard-nav-item').click()
    cy.get('.session-info')
      .contains("Mon 21 Feb 8 AM, Womens Night 2: Trav's Triangle")
      .should('exist')
  })
  it('log in as dorothea kovacek and book to join new event ', () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type('franco.walsh@testa.rossa')
    cy.get('[data-cy=password-input]').type('me2')
    cy.get('[data-cy=login-btn]').click()
    cy.get('#bookings-nav-item').should('exist')
    cy.get('[data-cy=book-event]').should('be.enabled').click()
    cy.get('.right-col > .MuiButtonBase-root').click()
    cy.get('#dashboard-nav-item').click()
    cy.get('.session-info')
      .contains("Mon 21 Feb 8 AM, Womens Night 2: Trav's Triangle")
      .should('exist')
      .click()
  })
})
