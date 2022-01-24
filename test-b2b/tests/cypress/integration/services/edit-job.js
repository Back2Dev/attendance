Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('log into app, create a service and edit the job created', () => {
  before(function () {
    freshDatabase()
  })

  it('navigates to Back2bikes homepage logs in and switches role to admin', function () {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(this.users.mike.username)
    cy.get('[data-cy=password-input]').type(this.users.mike.password)
    cy.get('[data-cy=login-btn]').should('exist').click()
    cy.get('[data-cy=member-portal]').should('exist')

    cy.get(
      '[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root > .MuiSvgIcon-root'
    ).click()

    cy.get('[data-cy=switch-role]').click()
    cy.get('[value="ADM"]').last().click()

    //opens  manager menu navigates to create service page and adds minor service', function () {
    cy.get('[data-cy=adm-drawer]').click()
    cy.get('div').contains('Manager').click()
    cy.get('[href="/services/new"]').should('exist').click()
    cy.get('#service-total').should('exist')

    cy.get('.tags-selector > :nth-child(2) > .MuiButtonBase-root').click()
    cy.get('[data-cy="minor"]').click()
    cy.get('#service-item-select').clear().type('Bar tape')
    cy.get('div').contains('Bar tape $20').click()

    cy.get('#service-item-select').clear().type('Cable Fitting X 2 $30')
    cy.get('div').contains('Cable fitting x 2 $30').click()

    cy.get('#service-next-btn').click()

    cy.get('[name="assessor"]').clear().type('Super Mario')
    cy.get('[name="bikeName"]').clear().type('Giganto')
    cy.get('[name="dropoffDate"]').clear().type('2022-01-19')
    cy.get('[name="pickupDate"]').clear().type('2022-02-01')
    cy.get('[name="replacementBike"]').clear().type('N/A')
    cy.get('[name="budget"]').clear().type('199')
    cy.get('[data-cy="bike-back"]').click()
    cy.get('#service-next-btn').click()

    cy.get('[name="note"]').clear().type('no replacement bike required')
    cy.get('[data-cy="next"]').click()

    cy.get('.new-member-btn').click()
    cy.get('[name="name"]').clear().type('Pat Carmel')
    cy.get('[name="mobile"]').clear().type('12')
    cy.get('[name="email"]').clear().type('mario.super@gurgle.111')

    cy.get('[data-cy="submit"]').click()

    cy.get('.jobs-header > .MuiTypography-root').should('exist')

    cy.get('div').contains('Giganto').should('exist')
  })

  it('selects the new job and views the job details', () => {
    cy.visit('/services')
    cy.get('[data-cy=email-input]').type('mike.king@mydomain.com.au')
    cy.get('[data-cy=password-input]').type('me2')
    cy.get('[data-cy=login-btn]').should('exist').click()
    // cy.get('.jobs-header > .MuiTypography-root').should('exist')
    cy.get('#bookings-nav-item').should('exist')
    cy.get('h1').contains('Jobs').should('exist')
    cy.get('div').contains('Giganto').should('exist').click()

    cy.wait(200)
    cy.get('h1').contains('Pat Carmel: Giganto ').should('exist')

    // changes or adds a mechanic
    cy.get('[data-cy="change-mechanic"]').click()
    cy.get('[data-cy="mechanic-select"]').clear().type('super.mario@mario.com')

    cy.get('[role="option"][data-option-index="0"]').click()

    cy.get('[data-cy="select"]').click()

    // // adds a new part
    cy.get(
      '.header > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root > path'
    ).click()

    cy.get('#service-item-select').clear().type('Bell')
    cy.get('div').contains('Bell $6').click()

    cy.get('[data-cy="quick-update"]').click()

    // // views job
    cy.get('[data-cy="job-card"]').click()

    cy.get('[data-cy=mark-paid]').click()
    cy.get('[data-cy="yes-job-card"]').click()

    cy.wait(100)
    // move the job to step 4 ready for pickup
    // this element is disabled
    cy.get('div').contains('Quality Check').click()

    cy.get('[data-cy="qa-mechanic"]').clear().type('super.mario@mario.com')
    cy.get('[role="option"][data-option-index="0"]').click()
    cy.get('#qa-passed').click()
    cy.get('[data-cy="qa-submit"]').should('exist').click()

    cy.wait(100)

    cy.get('div').contains('Completed').click()

    cy.get('[data-cy="send-sms"]').click()

    cy.get('[data-cy="submit-sms"]').click()

    // // checks if sms exists
    // cy.get(':nth-child(3) > .created').should('exist')
  })
})
