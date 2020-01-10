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
const testData = [
  { name: 'Tough Guy', card: '4242000000000001' },
  { name: 'Jackie Chan', card: '4242000000000002' },
  { name: 'Bruce Lee', card: '4242000000000003' }
]
const pin = '1234'

describe('fix bug', () => {
  it('create 3 members', () => {
    testData.forEach(({ name, card }) => {
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

      cy.wait(1000)

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

      cy.get('input[id=mockName]')
        .clear()
        .type(name)
      cy.get('input[id=mockNumber]')
        .clear()
        .type(card)
      cy.get('input[id=mockCvc]')
        .clear()
        .type('000')
      cy.get('input[id=mockExpiry]')
        .clear()
        .type('12/22')

      cy.get('button')
        .contains('Register card')
        .click()

      cy.get('td')
        .contains(name)
        .should('exist')

      cy.get('td')
        .contains('XXXX-XXXX-XXXX-' + card.slice(-4))
        .should('exist')
      cy.wait(1000)

      cy.get('button')
        .contains('Back to the shop')
        .click()
    })

    rmToughGuy()
    rmJackieChan()
    rmBruceLee()
  })
})
