import { existingCustomer, conveyancer, pm } from '/tests/cypress/fixtures/users.json'
import moment from 'moment'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Runs through botp workflow', function () {
  before(function () {
    freshDatabase()
  })
  beforeEach(function () {
    cy.fixture('addresses').then(function (addresses) {
      this.buy = addresses.buy
    })
  })

  it('Customer adds a new property', function () {
    cy.loginFromHomepage(existingCustomer.username, existingCustomer.password)
    cy.get('[data-cy=add-btn]').should('exist')
    cy.get('[data-cy=add-btn]').click()
    cy.AddAddress(this.buy)
    cy.UploadDocument('contract.pdf', false)
    cy.get('[value="buy"]').should('exist').click()
    cy.get('#uniforms-0000-0004 > :nth-child(1)').click()
    cy.get('[data-cy=addproperty-submit]').click()
  })

  it('checks if the property exists in the PM property page', function () {
    cy.PMDispatcher(pm.username, pm.password, this.buy)
  })
})

describe('Completes the botp workflow', () => {
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
  it('Conveyancer reviews cos', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.ApproveDocument('[data-cy=review-review-cos]')
  })
  it('Customer uploads a signed contract', function () {
    cy.visit('/properties').wait(1000)
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.buy).click()
    // On the customer property page, is the button for the upload there?
    cy.get('#upload-scos').should('exist').click()
    // On the upload page, is the heading for the upload there?
    cy.get('h1#upload-scos').should('exist')
    // Upload the contract of sale and click the upload button
    cy.UploadDocument('contract.pdf', true)
    // Final check
    cy.get('.current').should('not.exist')
  })
  it('Conveyancer uploads the engagement letter', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-egl]').should('exist').should('be.enabled')
    cy.get('[data-cy=upload-egl]').should('exist').click()
    cy.get('h1#upload-egl').should('exist').UploadDocument('contract.pdf', true)
  })
  it('PM approves the engagement letter', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.ApproveDocument('[data-cy=review-approve-egl]')
  })
  it('Conveyancer completes the cost disclosure', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=webform-cost-disclosure]')
      .should('exist')
      .should('be.enabled')
      .click()
    cy.CompleteCostDisclosure(existingCustomer.username, this.buy)
    cy.get('[data-cy=webform-cost-disclosure]').should('be.disabled')
  })

  it('PM approves cost disclosure', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.get('[data-cy=webform-approve-cdc]').should('exist').should('be.enabled').click()
    cy.PMApproveCDC(existingCustomer.username, existingCustomer.name, this.buy)
    cy.get('[data-cy=webform-approve-cdc]').should('be.disabled')
    logout()
  })
  it('Customer completes client authorisation form', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.buy).click()
    cy.get('#client-auth').should('exist').click()
    cy.CompleteClientAuth(existingCustomer.name, this.buy)
    cy.get('.current').should('not.exist')
  })
  it('PM reviews client authorisation form', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.get('[data-cy=webform-approve-caf]').should('exist')
    cy.get('[data-cy=webform-approve-caf]').click()
    cy.PMReviewCAF(existingCustomer.name, this.buy)
  })
  it('Conveyancer sends document reminder', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.SendNotification('#notification-initial-remind')
  })
  it('Conveyancer uploads some initial documents', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-other]').should('be.enabled')
    cy.get('[data-cy=upload-other]').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('PM reviews initial documents', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.ApproveDocument('[data-cy=review-initial-review]')
  })
  it('Conveyancer sets plan registration date', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=set-date-set-plan-date]').should('be.enabled').click()
    cy.get('#date-picker').clear().type(moment().add(20, 'days').format('DDMMYYYY'))
    cy.get('[data-cy="set-time-date').click()
    cy.get('[data-cy=set-date-set-plan-date]').should('contain', 'Change date and time')
  })
  it('Conveyancer sets settlement date', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=set-date-settle-time]').should('be.enabled').click()
    cy.get('#date-picker').clear().type(moment().add(30, 'days').format('DDMMYYYY'))
    cy.get('[data-cy="set-time-date').click()
  })
  it('Customer completes buyer questionnaire', function () {
    cy.visit('/properties')
    login(existingCustomer.username, existingCustomer.password)
    cy.get('.address > a').contains(this.buy).click()
    cy.get('#buyer-q').should('exist').click()
    cy.get('#start-webform').should('be.enabled').click()
    cy.get('#buyerType > :nth-child(1)').click()
    cy.get('#individual-name').type(existingCustomer.name)
    cy.get('#individual-email').type(existingCustomer.username)
    cy.get('#individual-mobile').type(existingCustomer.phone)
    cy.get('#google-places-search')
      .clear()
      .type(this.buy)
      .blur()
      .should('have.attr', 'value', this.buy)
    cy.get(
      ':nth-child(6) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #google-places-search'
    )
      .clear()
      .type(this.buy)
      .blur()
      .should('have.attr', 'value', this.buy)

    // remove this as we dont need to fill out the company details.
    cy.get('#buyerType > :nth-child(2)').click()
    cy.get('#company-name').should('exist').type('123 Company')
    cy.get('#company-abn').type('123456789')
    cy.get('#company-email').type(existingCustomer.username)
    cy.get('#company-director1').type(existingCustomer.name)
    cy.get('#company-director2').type(existingCustomer.name)
    cy.get('#company-mobile').type(existingCustomer.phone)
    cy.get('#google-places-search').first().type(this.buy).blur()
    //
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
    cy.SubmitWebform()
    cy.get('.current').should('not.exist')
  })

  it('Conveyancer sends SRO notification', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.SendNotification('#notification-buyer-sro-alert')
  })
  it('Conveyancer sends buyer alert', function () {
    login(conveyancer.username, conveyancer.password)
    cy.SendNotification('#notification-alert-buyer')
    logout()
  })
  it('Conveyancer uploads registered plan', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-rpl]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer uploads certificate of occupancy', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=upload-coo]').should('be.enabled')
    cy.get('[data-cy=upload-coo]').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer uploads SOA', function () {
    login(conveyancer.username, conveyancer.password)
    cy.get('[data-cy=upload-soass]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer uploads statement of cost', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-stc]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('PM approves statement of adjustment', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.ApproveDocument('[data-cy=review-review-soa]')
  })
  it('PM approves statement of costs', function () {
    login(pm.username, pm.password)
    cy.ApproveDocument('[data-cy=review-review-soc]')
  })
  it('Conveyancer uploads tax invoice', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=upload-tiv]').should('be.enabled').click()
    cy.UploadDocument('contract.pdf', true)
  })
  it('Conveyancer sends final inspection reminder to buyer and agent', function () {
    login(conveyancer.username, conveyancer.password)
    cy.SendNotification('#notification-final-inspect')
  })

  it('PM skips PEXA confirmation', function () {
    loginToNextStep(pm.username, pm.password, this.buy)
    cy.get('[data-cy=external-confirm-pexa]').should('exist').click()
    cy.get('#pexa-confirm').click().should('be.checked')
    cy.get('#complete').should('be.enabled').click()
  })
  it('Conveyancer sends out settled notice', function () {
    loginToNextStep(conveyancer.username, conveyancer.password, this.buy)
    cy.get('[data-cy=external-settled-notices]').should('be.enabled').click()
    cy.get('#send-settled').click().should('be.checked')
    cy.get('#complete').should('be.enabled').click()
  })
  it('Conveyancer sends out notices to authorities', function () {
    login(conveyancer.username, conveyancer.password)
    cy.SendNotification('#notification-auth-notices')
  })
})
