Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)
describe('Create event', () => {
  it('Navigate to events', () => {
    cy.visit('/')
    cy.get('#login-email')
      .clear()
      .type('admin')
    cy.get('#login-password')
      .clear()
      .type('me2')
    cy.get('#login').click()
    cy.get('#events-btn').click()
    cy.get('button')
      .contains('Add')
      .click()
    // Name
    cy.get('.tabulator-row > [tabulator-field="name"]').click()
    cy.get('input[type="text"]')
      .clear()
      .type('Test Name{enter}')
    // Description
    cy.get('.tabulator-row > [tabulator-field="description"]').click()
    cy.get('input[type="text"]')
      .clear()
      .type('Test Description{enter}')
    // Location
    cy.get('.tabulator-row > [tabulator-field="location"]').click()
    cy.get('input[type="text"]')
      .clear()
      .type('Test Location{enter}')
    // When
    cy.get('.tabulator-row > [tabulator-field="when"]')
      .click()
      .type('2019-12-23')
    cy.get('.segment').click() // Active
    cy.get('[tabulator-field="active"] > svg > path').click()
    cy.get('.tabulator-editing > input').click()
    // Duration
    cy.get('.tabulator-row > [tabulator-field="duration"]').click()
    cy.get('input[type="text"]')
      .clear()
      .type('23{enter}')
    // Price
    cy.get('.tabulator-row > [tabulator-field="price"]').click()
    cy.get('input[type="text"]')
      .clear()
      .type('55{enter}')
    // Type
    // cy.get('.tabulator-row > [tabulator-field="type"]').click()
    // cy.get('.tabulator-editing > input').select('monthly')
    // Days check
    cy.get('[tabulator-field="day0"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day1"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day2"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day3"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day4"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day5"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day6"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    // Days uncheck
    cy.get('[tabulator-field="day0"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day1"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day2"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day3"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day4"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day5"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    cy.get('[tabulator-field="day6"] > svg').click()
    cy.get('.tabulator-editing > input').click()
    // Delete row
    cy.get('input[type="checkbox"]').click()
    cy.get('button')
      .contains('Delete')
      .click()
  })
})
