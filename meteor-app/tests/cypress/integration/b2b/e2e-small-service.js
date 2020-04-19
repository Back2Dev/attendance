Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('Small Service Test', function () {
  it('retrieves the url and goes to Assessment Webpage', () => {
    // goes to the Assessment Webpage
    cy.visit('/assessment')
  })

  it('Login to to the page', () => {
    // goes to the Assessment Webpage

    cy.get('input[name=email]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name=password]').clear().type('me2')
    // .contains('Password')

    cy.get('button').contains('Submit').should('be.enabled').click()
  })

  it('Checks that the correct page has loaded.', function () {
    cy.get('a[href="/assessment"]').should('exist').click()

    cy.get('div:has(h2)').contains('Select Base Assessment')
  })

  it('Gets the Minor Service Webform.', function () {
    // TODO: eliminate use of nth-child
    cy.get(':nth-child(2)> .button').contains('Minor Service').click()
  })

  // it('Opens the minor service web form.', function ()
  //     cy.get('#minor-service').click()
  //

  it('Assessor name and details of customers bike.', function () {
    cy.get('#root_assessor').clear().type('Pat Caramello')
    cy.get('#root_bikeMake').clear().type('Shimano')
    cy.get('input#root_bikeModel').clear().type('Very Fast')

    cy.get('#root_bikeColor').type('Red')

    cy.get('#root_approxBikeValue').clear().type('200')
    cy.get('#root_services_0').uncheck()

    cy.get('#root_services_1').uncheck()

    cy.get('#root_services_2').uncheck()

    cy.get('#root_services_3').uncheck()

    cy.get('#root_services_7').check()
    cy.get('#root_services_9').check()

    // gets the button and determines whether it exists

    cy.get('button')
      .contains('Next')
      .should('exist')
      .should('be.enabled')
      .click()
  })

  it('checks if the correct page has loaded and whether button loaded the correct webpage.', function () {
    cy.get('div.header').contains('Select Parts')
  })

  it('Selects extra parts to complete service and gets from the Assessor about extra parts cost of the extra parts.', function () {
    //cy.get('#root_parts_9').check() // checks the rear brake cable option.
    cy.get('#root_parts_5').check() // checks the V brake pad option.
    cy.get('#root_parts_13').check() //

    cy.get('#root_comments')
      .clear()
      .click()
      .type('Had to wait for more parts to come in.')

    cy.get('#root_additionalFee').clear().type('50')

    cy.get('#root_discount').clear().type('0')

    cy.get('#root_discountReason').type('No discount')

    cy.get('button')
      .contains('Next')
      .should('exist')
      .should('be.enabled')
      .click()
  })

  it('checks if whether the correct page has loaded and whether button loaded the correct webpage.', function () {
    cy.get('div:has(h1)').contains('Review your details')
  })

  it('checks whether if correct data is stored in the webpage.', function () {
    // checks the specifications of the bike.
    cy.get('div:has(li)').contains('Shimano')
    cy.get('div:has(li)').contains('Very Fast')
    cy.get('div:has(li)').contains('Red')
    cy.get('div:has(li)').contains('200')

    // checks what the bike needs fixed.
    cy.get('div:has(li)').contains('Check tyre pressure')
    cy.get('div:has(li)').contains('Lube derailleurs')
    cy.get('div:has(li)').contains(
      'Check/tighten bolts on cranks, headset, wheels and bottom bracket'
    )
    cy.get('div:has(li)').contains('Check wheels are true')
    cy.get('div:has(li)').contains('Clean and re-grease headset')
    // checks if the correct parts are displayed on the confirmation web page.
    cy.get('div:has(li)').contains('Brake pads - V brakes ($10)')
    cy.get('div:has(li)').contains('Cable fitting x 2 ($30)')
    cy.get('div:has(li)').contains(
      'Had to wait for more parts to come in.'
    )
    cy.get('ul:has(li)').contains('50')
    cy.get('div:has(li)').contains('No discount')
    // checks if the service is the one selected
    cy.get('div:has(li)').contains('Minor Service')
    // Total Price
    cy.get('div:last-child').contains('Less Discount: $0')
    cy.get('div:nth-child(3)').contains('Additional Fee: $50')
    cy.get('div:nth-child(2)').contains('Total Parts Cost: $40')
    cy.get('div:even').contains('Total Price = $134')

    // hits next button to Customer details page and check if button exists
    cy.get('button')
      .contains('Next')
      .should('exist')
      .should('be.enabled')
      .click()
  })

  it('Loads the Customer Details webpage.', function () {
    cy.get('#root__title').contains('Enter Customer Details')
  })

  it('Input customer data', function () {
    cy.get('#root_pickUpDate').clear().type('2019-11-12')

    cy.get('#root_name').clear().type('Roger dodson')

    cy.get('input[type="email"]')
      .clear()
      .type('R.dodson@bogus.arrival')

    cy.get(':nth-child(5) > .ui > input')
      .clear()
      .type('0461 9990 1043')

    //gets the button checks whether it has the property next and goes to the next webpage
    cy.get('button')
      .contains('Submit')
      .should('exist')
      .should('be.enabled')
      .click()

    // Check that the service was created ok
    cy.get('.s-alert-success').should('exist')
    cy.get('h1').contains('Congratulations')
  })
})
