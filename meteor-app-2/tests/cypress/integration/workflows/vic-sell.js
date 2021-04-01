import { conveyancer, existingCustomer, pm } from '/tests/cypress/fixtures/users.json'
import moment from 'moment'

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Runs through sell workflow', function () {
  before(function () {
    freshDatabase()
  })
  beforeEach(function () {
    cy.fixture('addresses').then(function (addresses) {
      this.sell = addresses.sell
    })
  })
  it('Customer adds a new property', function () {
    cy.loginFromHomepage(existingCustomer.username, existingCustomer.password)
        cy.get('a[href="/dashboard"]').should('exist').click()
        cy.get('[data-cy=add-btn]').should('exist').click()
    cy.AddAddress(this.sell)
    cy.get('[value="sell"]').should('exist').click()
    cy.get('[data-cy=addproperty-submit]').click()
  })

  it('checks if the property exists in the PM property page', function () {
    cy.PMDispatcher(pm.username, pm.password, this.sell)
  })
})

describe('Walks through the next-steps components', () => {
  beforeEach(function () {
    cy.fixture('addresses').then(function (addresses) {
      this.sell = addresses.sell
    })
  })
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
    cy.wait(200)
  })
  it('PM assigns a conveyancer', function () {
    loginToNextStep(pm.username, pm.password, this.sell)
    cy.AssignConveyancer()
  })
  it('Conveyancer uploads the engagement letter', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=upload-egl]').should('exist').should('be.enabled').click()
    cy.get('h1#engagement-letter').should('exist')
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer completes the cost disclosure', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=webform-cost-disclosure]')
      .should('exist')
      .should('be.enabled')
      .click()
    cy.CompleteCostDisclosure(existingCustomer.username, this.sell)
  })
  it('PM reviews engagement letter', function () {
    loginToNextStep(pm.username, pm.password, this.sell)
    cy.get('[data-cy=review-approve-egl]').should('exist').should('be.enabled').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-approve-egl]').should('be.disabled')
  })
  it('PM reviews the cost disclosure form', function () {
    login(pm.username, pm.password)
    cy.get('[data-cy=webform-approve-cdc]').should('exist').should('be.enabled').click()
    cy.PMApproveCDC(existingCustomer.username, existingCustomer.name, this.sell)
  })
  it('Customer completes client authorisation form', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.sell).click()
    cy.get('#client-auth').should('exist').click()
    cy.CompleteClientAuth(existingCustomer.name, this.sell)
    cy.get('.current').should('not.exist')
  })
  it('PM reviews client authorisation form', function () {
    loginToNextStep(pm.username, pm.password, this.sell)
    cy.get('[data-cy=webform-pm-auth]').should('be.enabled').click()
    cy.get('#start-webform').click()
    for (let i = 0; i <= 3; i++) {
      cy.WebformPressNext()
    }
    cy.SubmitWebform()
  })
  it('PM skips the sellers questionnaire', function () {
    loginToNextStep(pm.username, pm.password, this.sell)
    cy.get('#skip-seller-q').click()
    cy.get('#yes-skip').click()
  })
  // it('Customer completes sellers questionnaire', function () {
  //   cy.visit('/properties')
  //   login(existingCustomer.username, existingCustomer.password)
  //   cy.get('.address > a').contains(this.sell).click()
  //   cy.get('#seller-q').should('exist').click()
  //   cy.get('#start-webform').should('exist').click()
  //   cy.get('#sellerType > :nth-child(1)').click()
  //   cy.get('#individual-name').type(existingCustomer.name)
  //   cy.get('#individual-email').type(existingCustomer.username)
  //   cy.get('#individual-mobile').type(existingCustomer.phone)
  //   cy.get('#google-places-search')
  //     .clear()
  //     .type(this.sell)
  //     .blur()
  //     .should('have.attr', 'value', this.sell)
  //   cy.get(
  //     ':nth-child(6) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #google-places-search'
  //   )
  //     .clear()
  //     .type(this.sell)
  //     .blur()
  //     .should('have.attr', 'value', this.sell)
  //   // remove this as we dont need to fill out the company details.
  //   // cy.get('#sellerType > :nth-child(2)').click()
  //   // cy.get('#company-name').should('exist').type('123 Company')
  //   // cy.get('#company-abn').type('123456789')
  //   // cy.get('#company-email').type(existingCustomer.username)
  //   // cy.get('#company-director1').type(existingCustomer.name)
  //   // cy.get('#company-director2').type(existingCustomer.name)
  //   // cy.get('#company-mobile').type(existingCustomer.phone)
  //   // cy.get('#google-places-search').first().type(this.sell)
  //   cy.WebformPressNext()
  //   // cy.get('#exemptions-fhog').check()
  //   // cy.get(
  //   //   '#ausCitizens > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > input'
  //   // ).click()
  //   // cy.WebformPressNext()
  //   // cy.get('#insured > :nth-child(1)').click()
  //   // cy.get('#propertyType > :nth-child(1)').click()
  //   // cy.get('#purchaseReason > :nth-child(1)').click()
  //   // cy.get('#depositPaid > :nth-child(1)').click()
  //   // cy.WebformPressNext()
  //   // cy.get('#proprietor > :nth-child(1)').click()
  //   // cy.WebformPressNext()
  //   // cy.SubmitWebform()
  // })

  it('Conveyancer completes title search', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=external-title-search]').should('exist').click()
    cy.get('[type="checkbox"]').check()
    cy.get('#complete').should('exist').click()
  })

  it('Conveyancer uploads initial s27', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=upload-s27]').should('exist').click({ force: true })
    cy.UploadDocument('contract.pdf', true)
  })
  it('Customer uploads signed s27', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.sell).click()
    cy.get('#sign-27-1').should('exist').click()
    cy.UploadDocument('contract.pdf', true)
    cy.get('.current').should('not.exist')
  })
  it('Conveyancer uploads draft cos', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=upload-cos]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer uploads draft s32', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=upload-s32]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('PM approves draft contract of sale and s32', function () {
    loginToNextStep(pm.username, pm.password, this.sell)
    cy.get('[data-cy=review-approve-contract]').should('exist').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-approve-contract]').should('be.disabled')

    cy.get('[data-cy=review-approve-s32]').should('exist').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-approve-s32]').should('be.disabled')
  })
  it('PM approves s32', function () {
    login(pm.username, pm.password)
    cy.get('[data-cy=review-sign-s32]').should('exist').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-sign-s32]').should('be.disabled')
  })
  it('Conveyancer releases Section 32 to agent', function () {
    cy.get('[data-cy=review-release-s32]').should('be.enabled').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-release-s32]').should('be.disabled')
  })
  it('Customer uploads a signed cos', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.sell).click()
    cy.get('#seller-sign-contract').should('exist').click()
    cy.UploadDocument('contract.pdf', true)
    cy.get('.current').should('not.exist')
  })
  it('Conveyance uploads the signed cos from buyer', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=upload-cos]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer completes sale is unconditional', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=external-unconditional]').should('be.enabled').click()
    cy.get('#scos').click().should('be.checked')
    cy.get('#complete').click()
  })
  it('Conveyancer sets the settlement date', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=set-date-settlement-date-time]').should('be.enabled').click()
    cy.get('#date-picker').clear().type(moment().add(10, 'days').format('DDMMYYYY'))
    cy.get('[data-cy="set-time-date').click()
  })
  it('Conveyancer sends seller alert', function () {
    login(conveyancer.username, conveyancer.password)
    cy.SendNotification('#notification-seller-alert')
  })
  it('Conveyancer sends SRO alert', function () {
    login(conveyancer.username, conveyancer.password)
    cy.SendNotification('#notification-seller-sro-alert')
  })

  it('conveyancer uploads statement of costs', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=upload-stc]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer uploads SOA', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=upload-soass]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('conveyancer uploads the tax invoice', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=upload-tiv]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('PM approves the SOA', function () {
    login(conveyancer.username, conveyancer.password)
    cy.ApproveDocument('[data-cy=review-approve-soa]')
  })
  it('Conveyancer uploads account sales', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=upload-acs]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('PM completes PEXA checklist', function () {
    loginToNextStep(pm.username, pm.password, this.sell)
    cy.get('[data-cy=external-pexa-settled]').should('be.enabled').click()
    cy.get('#pexa-confirm').click().should('be.checked')
    cy.get('#complete').should('be.enabled').click()
  })
  it('Conveyancer sends settlement completion to seller', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.SendNotification('#notification-settle-complete')
  })
  it('Conveyancer sends notice to authorities', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.sell)
    cy.get('[data-cy=external-notify-authorities]').should('be.enabled').click()
    cy.get('#send-notices-auth').click().should('be.checked')
    cy.get('#complete').click()
  })
})
