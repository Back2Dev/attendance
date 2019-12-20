import moment from 'moment'

/// <reference types="Cypress" />

describe('Make Payment', function() {
  it('cash payment', function() {
    cy.visit('/')
    mkToughGuy()
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

    cy.url().should('include', '/')

    cy.get('div')
      .contains('Users')
      .should('exist')
      .click()

    cy.get('button[about="Tough Guy"]')
      .should('exist')
      .contains('Add...')
      .click()

    cy.url().should('include', '/shop')

    cy.get('button[id=multi_pass]')
      .should('exist')
      .click()
    cy.url().should('include', '/shop/type/pass')

    cy.get('button[id=pa_multipass_x_10]')
      .should('exist')
      .click()

    cy.get('button')
      .contains('Go to checkout now')
      .click()

    cy.url().should('include', '/shop/checkout')

    cy.get('input[name=promo]')
      .clear()
      .type('JARAD-ROOLS')

    cy.get('button')
      .contains('Check')
      .click()

    cy.get('input[value=cash]').check()

    cy.get('button')
      .contains('Do it')
      .click()

    cy.url().should('include', '/shop/paid')

    cy.get('button')
      .contains('Back to the checkin')
      .click()

    cy.url().should('include', '/')

    cy.get('div')
      .contains('Users')
      .click()

    cy.url().should('include', '/admin/userprofiles')

    cy.get('div')
      .contains('Tough Guy')
      .click()

    cy.get('div[class="ui card"]')
      .last()
      .contains('PA-PASS-MULTI-10')
      .should('exist')

    cy.get('div[class="ui card"]')
      .last()
      .contains('status: complete cash')
      .should('exist')

    cy.get('div[class="ui card"]')
      .last()
      .contains(moment().format('DD MMM YYYY'))
      .should('exist')

    cy.get('div[class="ui card"]')
      .last()
      .contains('150')
      .should('exist')

    cy.get('div')
      .contains(moment().format('DD MMM YYYY') + ' PA-PASS-MULTI-10 PA Multipass x 10')
      .should('exist')

    cy.get('div[class*="card-details-attributes"]')
      .contains('Member Type current pass')
      .should('exist')

    rmToughGuy()
  })
})
