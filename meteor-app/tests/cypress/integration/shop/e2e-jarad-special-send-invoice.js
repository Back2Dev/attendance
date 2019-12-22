import faker from 'faker'
import moment from 'moment'

const pin = '1234'

describe('Shopping Payment', function() {
  it('Choose Product', function() {
    cy.visit('/admin/userprofiles/')
    mkToughGuy()

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
    cy.get('button[about="Tough Guy"]')
      .contains('Add...')
      .click()
    cy.get('button#multi_pass')
      .contains('Multi pass')
      .should('exist')
      .click()
    cy.get('button#pa_casual_session')
      .should('exist')
      .click()
    cy.get('button#checkout')
      .should('exist')
      .click()
    // Admin promo code brings up form
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
      .type('JARAD-ROOLS')
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('input[value="email"]')
      .should('exist')
      .click()
    cy.get('input[type="email"]').should('have.value', 'tough.guy@tough-guys.inc.inc')
    cy.get('button[id="doit"]')
      .should('exist')
      .click()
    cy.get('h2[class="ui header"').contains('tough.guy@tough-guys.inc.inc')
    cy.visit('/admin/userprofiles/')
    cy.get('div[class="content"]')
      .contains('Tough Guy')
      .should('exist')
      .click()
    cy.get('div[class="content"]').contains('1 x PA-CASUAL')

    cy.get('a')
      .contains('Sign Out')
      .click()

    //cy.visit('http://localhost:3030/shop/renew/MxKtsSeoSQ4KtX5CY/RYqXZpqzkQh2FKvYf')
    cy.visit(`/shop/renew/${sessionStorage.getItem('memberId')}/${sessionStorage.getItem('mycart')}`)

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

    // cy.get('div[class="ui card"]')
    //   .last()
    //   .contains('status: complete cash')
    //   .should('exist')

    cy.get('div[class="ui card"]')
      .last()
      .contains(moment().format('DD MMM YYYY'))
      .should('exist')

    cy.get('div[class="ui card"]')
      .last()
      .contains('20')
      .should('exist')

    // cy.get('div')
    //   .contains(moment().format('DD MMM YYYY') + ' PA-PASS-MULTI-10 PA Multipass x 10')
    //   .should('exist')

    // cy.get('div[class*="card-details-attributes"]')
    //   .contains('Member Type current pass')
    //   .should('exist')

    // Remove the tough guy at the end
    rmToughGuy()
  })
})
