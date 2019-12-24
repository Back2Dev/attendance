import moment from 'moment'
import faker from 'faker'

describe('Tough Guy makes a purchase', function() {
  it('Make like we clicked the link in the invoice email', function() {
    cy.visit('/')
    //
    // Load up the fixture data, which references the member and the cart
    //
    cy.fixture('tough-guy-cart').then(guy => {
      cy.log(`member/cart ${guy.memberId}/${guy.cartId}`)
      cy.visit(`/shop/renew/${guy.memberId}/${guy.cartId}`)
      cy.get('button')
        .contains('Next')
        .click()

      cy.get('button')
        .contains('Buy now')
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
      cy.pinType('name', 'Mickey Moto')
      cy.pinType('number', '4242000000000000')
      cy.pinType('cvc', '000')
      cy.pinType('expiry', '12/22')

      cy.get('button')
        .contains('Pay')
        .click()

      cy.url().should('include', '/shop/receipt')

      cy.get('button')
        .contains('Back to the shop')
        .click()

      cy.visit('/')
      cy.contains('Login').click()
      cy.url().should('include', '/login')

      cy.get('input[name=email]')
        .clear()
        .type('admin@back2bikes.com.au')

      cy.get('input[name=password]')
        .clear()
        .type('me2')

      cy.get('button')
        .contains('Submit')
        .should('be.enabled')
        .click()

      cy.get('div')
        .contains('Users')
        .click()

      cy.url().should('include', '/admin/userprofiles')

      cy.get('div')
        .contains('Tough Guy')
        .click()

      cy.get('div[class="ui card"]')
        .last()
        .contains('PA-CASUAL')
        .should('exist')

      cy.get('div[class="ui card"]')
        .last()
        .contains('status: complete')
        .should('exist')

      cy.get('div[class="ui card"]')
        .last()
        .contains(moment().format('DD MMM YYYY'))
        .should('exist')

      cy.get('div[class="ui card"]')
        .last()
        .contains('20')
        .should('exist')

      cy.get('div')
        .contains(moment().format('DD MMM YYYY') + ' PA-CASUAL PA Casual session')
        .should('exist')

      cy.get('div[class*="card-details-attributes"]')
        .contains('Member Type casual')
        .should('exist')
    })
  })

  // We won't remove the tough guy at the end, because it is convenient to be able
  // to look at the data afterwards
  // rmToughGuy()
})
