import moment from 'moment'
import faker from 'faker'
// ratPack is in cypress/support/index.js

describe('Rat Pack members take it in turn to make purchases', function() {
  //
  // Load up the fixture data, which references the member and the cart
  //
  it('Loops through rat pack', () => {
    ratPack.forEach(data => {
      cy.fixture(`${data.name.replace(/ /g, '-').toLowerCase()}-cart`).then(guy => {
        data.guy = guy // Hang on to the dude's data for now
      })
    })
  })
  ratPack.forEach(data => {
    it(`${data.name} clicks the link in the invoice email`, function() {
      cy.visit('/')
      cy.log(`member/cart ${data.guy.memberId}/${data.guy.cartId}`)
      cy.visit(`/shop/renew/${data.guy.memberId}/${data.guy.cartId}`)
      // Check that the cart has the correct product that we chose for them
      cy.get('div.header')
        .contains(data.memberType[1])
        .should('exist')
      if (data.change) {
        cy.get('button')
          .contains('Change')
          .should('exist')
          .click()
        cy.get('button')
          .contains(data.change)
          .should('exist')
          .click()
      }
      cy.get('div.header')
        .contains(data.change || data.memberType[1])
        .should('exist')
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
        .contains(data.memberType[1] !== 'PA Casual signup' ? 'Pay' : 'Register card')
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
        .contains(data.name)
        .click()

      cy.get('div[class="ui card"]')
        .last()
        .contains(`1 x PA-${data.memberType[1].includes('membership') ? 'MEMB' : 'CASUAL'}`)
        .should('exist')

      cy.get('div[class="ui card"]')
        .last()
        .contains('status: complete')
        .should('exist')

      cy.get('div[class="ui card"]')
        .last()
        .contains(moment().format('DD MMM YYYY'))
        .should('exist')

      // cy.get('div')
      //   .contains(moment().format('DD MMM YYYY') + ' PA-CASUAL PA Casual session')
      //   .should('exist')

      // cy.get('div[class*="card-details-attributes"]')
      //   .contains('Member Type casual')
      //   .should('exist')

      cy.visit('/signout')
      cy.wait(1000)
    })
  })

  // We won't remove the tough guy at the end, because it is convenient to be able
  // to look at the data afterwards
  // rmToughGuy()
})
