import moment from 'moment'
import faker from 'faker'

Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)
const testData = ['Tough Guy', 'Jackie Chan', 'Bruce Lee']
const pin = '1234'

describe('fix bug', () => {
  it('create 3 members', () => {
    // cy.contains('Login').click()
    // cy.url().should('include', '/login')

    // cy.get('input[name=email]')
    //   .clear()
    //   .type('admin@back2bikes.com.au')

    // cy.get('input[name=password]')
    //   .clear()
    //   .type('me2')

    // cy.get('button')
    //   .contains('Submit')
    //   .should('be.enabled')
    //   .click()

    testData.forEach(name => {
      cy.visit('/kiosk')

      cy.get('button')
        .contains('Register')
        .click()

      cy.get('button')
        .contains('Next')
        .click()

      cy.get('input[id="root_name"]')
        .clear()
        .type(name)
      cy.get('input[id=root_email]').type(faker.internet.email())
      cy.get('input[id=root_mobile]').type(faker.phone.phoneNumber())
      cy.get('input[id=root_pin]').type(pin)
      cy.get('input[id=root_pinConfirm]').type(pin)

      cy.get('button')
        .contains('Next')
        .click()

      cy.get('input[id=root_emergencyContact]').type(faker.name.findName())
      cy.get('input[id=root_emergencyPhone]').type(faker.phone.phoneNumber())

      cy.get('button')
        .contains('Next')
        .click()

      cy.get('button')
        .contains('Next')
        .click()

      cy.get('input[id=root_swim]').check({ force: true })
      cy.get('input[id=root_terms]').check({ force: true })
      cy.get('input[id=root_fitness]').check({ force: true })

      cy.get('button')
        .contains('Next')
        .click()

      cy.get('button')
        .contains('Submit')
        .click()

      cy.get('div')
        .contains(name)
        .click()

      cy.get('input[name=pinInput]')
        .clear()
        .type(pin)

      cy.get('button')
        .contains('Please register your credit card')
        .click()

      cy.get('button')
        .contains('Next')
        .click()

      cy.get('input[name=email]')
        .clear()
        .type(faker.internet.email())
      cy.get('input[name=address_line1]')
        .clear()
        .type(faker.address.secondaryAddress())
      cy.get('input[name=address_city]')
        .clear()
        .type(faker.address.city())
      cy.get('input[name=address_state]')
        .clear()
        .type(faker.address.state())
      cy.get('input[name=address_postcode]')
        .clear()
        .type(faker.address.zipCode())
      cy.get('input[name=address_country]')
        .clear()
        .type(faker.address.country())

      cy.get('button')
        .contains('Next')
        .click()

      cy.wait(2000)
      Cypress.Commands.add('pinType', (field, text) => {
        cy.get('#' + field).within(() => {
          cy.get(`iframe`).then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body)
              .find(`.${field}`)
              .type(text)
          })
        })
      })

      cy.wait(2000)
      cy.pinType('name', name)
      cy.pinType('number', '4242000000000000')
      cy.pinType('cvc', '000')
      cy.pinType('expiry', '12/22')

      cy.get('button')
        .contains('Register card')
        .click()

      cy.wait(1000)

      cy.get('button')
        .contains('Back to the shop')
        .click()
    })
  })
})
