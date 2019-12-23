import faker from 'faker'
import moment from 'moment'

const pin = '1234'
let memberId
let cartId

describe('Shopping Payment', function() {
  beforeEach(() => {
    cy.visit('/kiosk')
    cy.window().then(win => {
      cartId = win.sessionStorage.getItem('mycart')
      memberId = win.sessionStorage.getItem('memberId')
    })
    cy.log(`member/cart ${memberId}/${cartId}`)
  })

  it('Create a member, and send an invoice email', function() {
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
  })
  it('Sign out, and pretend the user clickd the link in the email', function() {
    cy.log(`member/cart ${memberId}/${cartId}`)
    cy.visit('/signout')
    cy.visit(`/shop/renew/${memberId}/${cartId}`)
    cy.get('button')
      .contains('Next')
      .click()
  })

  // Remove the tough guy at the end
  // rmToughGuy()
})
