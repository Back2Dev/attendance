const faker = require('faker')

Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('Register as a volunteer on the registrations page, filling in all fields with valid data', () => {
  const name = faker.name.findName()
  const email = faker.internet.email()
  const mobile = faker.phone.phoneNumber('04########')
  const streetAddress = faker.address.streetAddress()
  const suburb = faker.address.cityName()
  const postcode = Math.floor(Math.random() * 999) + 3000
  const pin = faker.finance.mask(4, false, false)
  const bikes = [
    'Moutain',
    'Road/Racer',
    'Hybrid',
    'BMX',
    'Ladies',
    'Gents',
    'Vintage',
    'Cruiser',
    'Fixie/Single Speed',
  ]
  const workStatuses = [
    'Full Time',
    'Part Time',
    'Pension/Disability',
    'Unemployed',
    'Student',
    'Retired',
  ]
  const preferedBike = bikes[Math.floor(Math.random() * bikes.length)]
  const workStatus = workStatuses[Math.floor(Math.random() * workStatuses.length)]

  beforeEach(function () {
    loadCypressFixtures()
    cy.visit('/login')
    cy.get('[data-cy=email-input]').should('exist').type('mike.king@mydomain.com.au')
    cy.get('[data-cy=password-input]').should('exist').type('me2')
    cy.get('[data-cy=login-btn]').should('exist').click()
    cy.contains('Member Portal').should('exist')
    cy.visit('localhost:4090/admin/register')

    // dont use UI to log in
    // https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-In
  })

  it('successfully signs up an account with an email on the sign up page', function () {
    // 1. Contact details step
    cy.get('input[name="name"]').should('exist').type(name)
    cy.get('input[name="mobileNumber"]').should('exist').type(mobile)
    cy.get('input[name="email"]').should('exist').type(email)
    cy.get('input[name="streetAddress"]').should('exist').type(streetAddress)
    cy.get('input[name="suburb"]').should('exist').type(suburb)
    // TODO Change this ID in the form???
    cy.get('input[name="state"]').should('exist').parent().click()
    cy.get('li[data-value="VIC"]').should('exist').click()
    cy.get('input[name="postcode"]').should('exist').type(postcode)
    cy.get('input[name="pinNumber"]').should('exist').type(pin)
    cy.get('input[name="confirmPIN"]').should('exist').type(pin)
    cy.get('button[type="submit"]').should('exist').click()
    cy.contains("Let's learn a bit about you").should('exist')

    // 2. About you step
    cy.get('input[name="numBikes"]').should('exist').type(faker.datatype.number(10))
    // TODO Change this ID in the form???
    cy.get('input[name="preferedBike"]').should('exist').parent().click()
    cy.get(`li[data-value="${preferedBike}"]`).should('exist').click()
    cy.get('input[name="workStatus"]').should('exist').parent().click()
    cy.get(`li[data-value="${workStatus}"]`).should('exist').click()
    cy.get('textarea[name="volunteerReasons"]')
      .should('exist')
      .type(faker.lorem.sentences(Math.floor(Math.random() * 5)))
    cy.get('button[type="submit"]').should('exist').click()
    cy.contains('Who should we contact in an emergency?').should('exist')

    // 3. Emergency contact step
    cy.get('input[name="emergencyContactName"]')
      .should('exist')
      .type(faker.name.findName())
    cy.get('input[name="emergencyContactEmail"]')
      .should('exist')
      .type(faker.internet.email())
    cy.get('input[name="emergencyContactMobile"]')
      .should('exist')
      .type(faker.phone.phoneNumber('04########'))
    cy.get('button[type="submit"]').should('exist').click()
    cy.contains('Choose your avatar').should('exist')

    // 4. Avatar step
    // TODO Select a random avatar
    cy.get('button[type="submit"]').should('exist').click()
    cy.contains("Just making sure everything's correct").should('exist')

    // 5. Confirm step
    // TODO Confirm data is correct
    cy.get('input[name="agree"]').should('exist').click()
    cy.get('button[type="submit"]').should('exist').click()
    cy.contains('Registration Complete').should('exist')
  })
})
