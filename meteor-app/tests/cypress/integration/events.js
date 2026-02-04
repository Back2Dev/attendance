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
    cy.get('.MuiDataGrid-row [data-field="name"]').first().dblclick()
    cy.get('input[type="text"]')
      .clear()
      .type('Test Name{enter}')
    // Description
    cy.get('.MuiDataGrid-row [data-field="description"]').first().dblclick()
    cy.get('input[type="text"]')
      .clear()
      .type('Test Description{enter}')
    // Location
    cy.get('.MuiDataGrid-row [data-field="location"]').first().dblclick()
    cy.get('input[type="text"]')
      .clear()
      .type('Test Location{enter}')
    // When
    cy.get('.MuiDataGrid-row [data-field="when"]').first().dblclick()
    cy.get('input[type="text"]')
      .clear()
      .type('2019-12-23{enter}')
    // Active
    cy.get('.MuiDataGrid-row [data-field="active"] input[type="checkbox"]')
      .first()
      .click({ force: true })
    // Duration
    cy.get('.MuiDataGrid-row [data-field="duration"]').first().dblclick()
    cy.get('input[type="text"]')
      .clear()
      .type('23{enter}')
    // Price
    cy.get('.MuiDataGrid-row [data-field="price"]').first().dblclick()
    cy.get('input[type="text"]')
      .clear()
      .type('55{enter}')
    // Days check
    cy.get('.MuiDataGrid-row [data-field="day0"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day1"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day2"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day3"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day4"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day5"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day6"] input[type="checkbox"]').first().click({ force: true })
    // Days uncheck
    cy.get('.MuiDataGrid-row [data-field="day0"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day1"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day2"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day3"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day4"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day5"] input[type="checkbox"]').first().click({ force: true })
    cy.get('.MuiDataGrid-row [data-field="day6"] input[type="checkbox"]').first().click({ force: true })
    // Delete row
    cy.get('.MuiDataGrid-row input[type="checkbox"]').first().click({ force: true })
    cy.get('button')
      .contains('Delete')
      .click()
  })
})
