import { existingCustomer, conveyancer, pm } from '/tests/cypress/fixtures/users.json'
import moment from 'moment'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('adds a property from the landing page', () => {
  before(function () {
    freshDatabase()
  })
  beforeEach(function () {
    cy.fixture('addresses').then(function (addresses) {
      this.buy = addresses.buy
    })
  })
  it('Adds a property from the dashboard as a customer', function () {
    cy.loginFromHomepage(existingCustomer.username, existingCustomer.password)
    cy.get('[data-cy=add-btn]').should('exist').click()
    cy.AddAddress(this.buy)
    cy.get('[value="buy"]').should('exist').click()
    cy.get('#uniforms-0000-0004 > :nth-child(2)').click()
    cy.get('[data-cy=addproperty-submit]').click()
  })
  it('checks if the property exists in the PM property page', function () {
    cy.PMDispatcher(pm.username, pm.password, this.buy)
  })
})

describe('Walk through next steps', () => {
  beforeEach(function () {
    cy.fixture('addresses').then(function (addresses) {
      this.buy = addresses.buy
    })
    cy.wait(200)
  })
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  })
  it('PM assigns a conveyancer', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.AssignConveyancer()
  })
  it('Customer uploads a signed contract', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('a[href="/properties"]').should('exist')
    cy.get('.address > a').contains(this.buy).click()
    // On the customer property page, is the button for the upload there?
    cy.get('#upload-signed-cos').should('exist').click()
    // On the upload page, is the heading for the upload there?
    cy.get('h1#upload-signed-cos').should('exist')
    // Upload the contract of sale and click the upload button
    cy.UploadDocument('contract.pdf', true)
    // Final check
    cy.get('#upload-signed-cos').should('not.exist')
  })

  it('Conveyancer uploads an engagement letter', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-egl]').should('exist').should('be.enabled').click()
    cy.get('h1#engagement-letter').should('exist').UploadDocument('contract.pdf', true)
  })
  it('Conveyancer completes the cost disclosure', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=webform-cost-disclosure]')
      .should('exist')
      .should('be.enabled')
      .click()
    cy.CompleteCostDisclosure(existingCustomer.username, this.buy)
    cy.get('a[href="/properties"]').should('exist')
    cy.get('[data-cy=webform-cost-disclosure]').should('be.disabled')
  })
  it('PM reviews the engagement letter', function () {
    cy.wait(1000).visit('/properties')
    login(pm.username, pm.password)
    cy.get('.address > .MuiTypography-root').contains(this.buy).click()
    cy.get('[data-cy=review-approve-egl]').should('be.enabled').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-approve-egl]').should('be.disabled')
    logout()
  })
  it('PM reviews the cost disclosure form', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.get('[data-cy=webform-approve-cdc]').should('exist').should('be.enabled').click()
    cy.PMApproveCDC(existingCustomer.username, existingCustomer.name, this.buy)
    cy.get('[data-cy=webform-approve-cdc]').should('be.disabled')
    logout()
  })
  it('Customer will complete caf', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.buy).click()
    cy.get('#client-auth').should('exist').click()
    cy.CompleteClientAuth(existingCustomer.name, this.buy)
    cy.get('#client-auth').should('not.exist')
  })
  it('Conveyancer completes go ahead', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=external-go-ahead]').should('be.enabled').click()
    cy.get('#client-auth').check()
    cy.get('#complete').should('be.enabled').click()
  })
  it('Customer completes the buyers questionnaire', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.buy).click()
    cy.get('#buyer-q').should('exist').click()
    cy.get('#start-webform').should('be.enabled').click()
    cy.get('#buyerType > :nth-child(1)').click()
    cy.get('#individual-name').clear().type(existingCustomer.name)
    cy.get('#individual-email').clear().type(existingCustomer.username)
    cy.get('#individual-mobile').clear().type(existingCustomer.phone)
    cy.get('input[name="individual-residential"]').should('have.attr', 'value', this.buy)
    cy.get('input[name="individual-postal"]')
      .type(this.buy)
      .blur()
      .should('have.attr', 'value', this.buy)

    cy.WebformPressNext()
    cy.get('#exemptions-fhog').check().should('be.checked')
    cy.get(
      '#ausCitizens > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > input'
    ).click()
    cy.WebformPressNext()
    cy.get('#insured > :nth-child(1)').click()
    cy.get('#propertyType > :nth-child(1)').click()
    cy.get('#purchaseReason > :nth-child(1)').click()
    cy.get('#depositPaid > :nth-child(1)').click()
    cy.WebformPressNext()
    cy.get('#proprietor > :nth-child(1)').click()
    cy.WebformPressNext()
    cy.SubmitWebform(true)
    cy.get('#client-auth').should('not.exist')
  })
  it('conveyancer completes title search task', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=external-title-search]').should('be.enabled').click()
    cy.get('.MuiFormControlLabel-root').click()
    cy.get('#complete').should('be.enabled').click()
  })
  it('conveyancer uploads s27', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-s27]').first().should('be.enabled').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
  })
  it('conveyancer completes sale is unconditional', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=external-unconditional]').should('be.enabled').click()
    cy.get('a[href="/properties"]').should('exist')
    cy.get('#unconditional-sale').click().should('be.checked')
    cy.get('#complete').should('be.enabled').click()
  })
  it('conveyancer sets the settlement date and time', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=set-date-settle-date-time]').should('be.enabled').click()
    cy.get('#date-picker').clear().type(moment().add(10, 'days').format('DDMMYYYY'))
    cy.get('[data-cy="set-time-date').click()
  })
  it('conveyancer sends notifications', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('#notification-buyer-alert').should('be.enabled').click()
    cy.get('#notification-buyer-sro').should('be.enabled').click()
  })
  it('uploads statement of adjustment', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=upload-soass]').should('be.enabled').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
  })
  it('PM approves of the SOA', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.ApproveDocument('[data-cy=review-approve-soa]')

    cy.get('[data-cy=review-approve-soa]').should('be.disabled')
  })
  it('conveyancer uploads statement of costs', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-stc]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('conveyancer uploads the tax invoice', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=upload-tiv]').should('be.enabled')
    cy.get('[data-cy=upload-tiv]').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer sends final inspection reminder', function () {
    login(conveyancer.username, conveyancer.password)
    cy.SendNotification('#notification-final-inspection')
  })
  it('PM completes PEXA checklist', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.get('[data-cy=external-pexa-settled]').should('be.enabled')
    cy.get('[data-cy=external-pexa-settled]').click()
    cy.get('#pexa-confirm').click().should('be.checked')
    cy.get('#complete').should('be.enabled').click()
  })
  it('Conveyancer sends settle complete notifications', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.SendNotification('#notification-settle-complete')
  })
})
