import users from '/tests/cypress/fixtures/users.json'
import moment from 'moment'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

const address = 'Testing Grounds, City Road, Southbank VIC, Australia'

describe('adds a property from the landing page', () => {
  before(function () {
    freshDatabase()
  })
  it('Adds a property from the dashboard as a customer', () => {
    cy.loginFromHomepage(users.existingCustomer.username, users.existingCustomer.password)
    cy.get('[data-cy=add-btn]').should('exist').click()
    // Add property form
    cy.AddAddress(address)
    cy.get('[value="buy"]').should('exist').click()
    cy.get('[value="no"]').should('exist').click()
    // Upload a contract of sale
    cy.UploadDocument('contract.pdf') // No upload button
    // Now we are done!
    cy.get('[data-cy=addproperty-submit]').click()
  })
})

describe('walks through the dispatcher', () => {
  it('checks if the property exists in the PM property page', () => {
    cy.visit('/properties')
    login(users.pm.username, users.pm.password)
    cy.get('.address > .MuiTypography-root').should('contain', address)
    cy.get('.address > .MuiTypography-root').click()
    cy.get('[data-cy=success]').should('exist')
    cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
    cy.get('[name="referralSource"]').should('exist').clear().type('Barry Plant')
    cy.get('#cost-adorment-cost').should('exist').clear().type('660')
    cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
    cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
    cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
    cy.get('[data-cy=launch-job]').should('exist').click()
  })
})

describe('Walk through next steps', () => {
  before(() => {
    cy.get('[data-cy=email-input]').should('exist').clear().type(users.pm.username)
    cy.get('[data-cy=password-input]').should('exist').clear().type(users.pm.password)
    cy.get('[data-cy=login-btn]').click()
  })
  it('assigns a coneyancer', () => {
    cy.get('#properties-nav-item').click()
    cy.get('.address > .MuiTypography-root').click()
    cy.get('#assign-btn').should('be.enabled').click()
    cy.get('#conveyancer-select').type('Constantine').type('{downarrow}').type('{enter}')
    cy.get('#assign-con-btn').should('exist').click()
    cy.get('#assign-btn').should('contain', 'Reassign')
  })
  it('Uploads a signed contract as a customer', () => {
    cy.get('[data-cy=email-input]')
      .should('exist')
      .clear()
      .type(users.existingCustomer.username)
    cy.get('[data-cy=password-input]')
      .should('exist')
      .clear()
      .type(users.existingCustomer.password)
    cy.get('[data-cy=login-btn]').click()
    cy.wait(1000).visit('/properties')
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    // On the customer property page, is the button for the upload there?
    cy.get('button#upload-signed-cos').should('exist').click()
    // On the upload page, is the heading for the upload there?
    cy.get('h1#upload-signed-cos').should('exist')
    // Upload the contract of sale and click the upload button
    cy.UploadDocument('contract.pdf')
    // Final check
    cy.get('.current').should('not.exist')
    logout()
  })
  it('Conveyancer uploads an engagement letter', () => {
    login(users.conveyancer.username, users.conveyancer.password)
    cy.wait(1000).visit('/properties')
    cy.get('.address > .MuiTypography-root').contains(address).click()
    cy.get('[data-cy=upload-egl]').should('be.enabled').click()
    cy.get('.MuiTypography-h1')
      .invoke('text')
      .should('contain', 'Upload engagement letter')
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
    cy.contains('Upload engagement letter').should('not.exist')
    logout()
  })
  it('Conveyancer completes the cost disclosure', () => {
    cy.wait(1000).visit('/properties')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('.address > .MuiTypography-root').contains(address).click()
    cy.get('[data-cy=webform-cost-disclosure]').should('be.enabled').click()
    cy.get('#start-webform').should('be.enabled').click()
    cy.WebformPressNext()
    cy.get('#customer-email').as('cusEmail').clear().type('customer@test.com').blur()
    cy.get('@cusEmail').should('have.attr', 'value', 'customer@test.com')
    cy.AddAddress(address)
    cy.WebformPressNext()
    cy.get('#certificate-volume').type('00000').should('have.attr', 'value', '00000')
    cy.get('#certificate-folio').type('000').should('have.attr', 'value', '000')
    cy.WebformPressNext()
    cy.get('#invoice-cost').should('have.attr', 'value', '600')
    cy.get('#invoice-disbursements').type('0').should('have.attr', 'value', '0')
    cy.WebformPressNext()
    cy.SubmitWebform()
    cy.get('[data-cy=webform-cost-disclosure]').should('be.disabled')
    logout()
  })
  it('PM reviews the engagement letter', () => {
    cy.wait(1000).visit('/properties')
    login(users.pm.username, users.pm.password)
    cy.get('.address > .MuiTypography-root').contains(address).click()
    cy.get('[data-cy=review-approve-egl]').should('be.enabled').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-approve-egl]').should('be.disabled')
    logout()
  })
  it('PM reviews the cost disclosure form', () => {
    login(users.pm.username, users.pm.password)
    cy.get('[data-cy=webform-approve-cdc]').then((element) => {
      cy.wrap(element).should('exist')
      cy.wrap(element).click({ force: true })
    })
    cy.get('#start-webform').should('be.enabled').click()
    cy.WebformPressNext()
    cy.WebformPressNext()
    cy.WebformPressNext()
    cy.get('#invoice-disbursements').clear().type('110').blur()
    cy.WebformPressNext()
    cy.get('[data-cy=preview-btn]')
      .as('previewBtn')
      .invoke('text')
      .should('contain', 'Preview')
    cy.get('@previewBtn').click()
    cy.get('[data-cy=submit-webform]').should('be.enabled').click()
    logout()
  })
  it('Customer will complete caf', () => {
    cy.visit('/properties')
    login(users.existingCustomer.username, users.existingCustomer.password)
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('.current > button').then((element) => {
      cy.wrap(element)
        .invoke('text')
        .should('contain', 'Complete client authorisation form')
      cy.wrap(element).click()
    })
    cy.get('#start-webform').should('be.enabled').click()
    cy.WebformPressNext()
    cy.get('#client-name').type(users.existingCustomer.name)
    cy.AddAddress(address)
    cy.WebformPressNext()
    cy.get('#authority').first().click()
    cy.WebformPressNext()
    cy.AddAddress(address)
    cy.get('#land-titleref').type('12345')
    cy.get('#transaction-mortgage').check()
    cy.WebformPressNext()
    cy.SubmitWebform()
  })
  it('Conveyancer completes go ahead', () => {
    cy.wait(1000).visit('/properties')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('[data-cy=external-go-ahead]').should('be.enabled').click()
    cy.get('#client-auth').check()
    cy.get('#complete').should('be.enabled').click()
  })
  it('Customer completes the buyers questionnaire', () => {
    cy.wait(1000).visit('/properties')
    login(users.existingCustomer.username, users.existingCustomer.password)
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('.current > button').then((element) => {
      cy.wrap(element).invoke('text').should('contain', "Complete buyer's questionnaire")
      cy.wrap(element).click()
    })
    cy.get('#start-webform').should('be.enabled').click()
    cy.get('#buyerType > :nth-child(1)').click()
    cy.get('#individual-name').type(users.existingCustomer.name)
    cy.get('#individual-email').type(users.existingCustomer.username)
    cy.get('#individual-mobile').type(users.existingCustomer.phone)
    cy.get('#google-places-search')
      .clear()
      .type(address)
      .blur()
      .should('have.attr', 'value', address)
    cy.get(
      ':nth-child(6) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #google-places-search'
    )
      .clear()
      .type(address)
      .blur()
      .should('have.attr', 'value', address)

    cy.WebformPressNext()
    cy.get('#exemptions-fhog').check()
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
  })
  it('conveyancer completes title search task', () => {
    cy.wait(1000).visit('/properties')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('[data-cy=external-title-search]').should('be.enabled').click()
    cy.get('.MuiFormControlLabel-root').click()
    cy.get('#complete').should('be.enabled').click()
  })
  it('conveyancer uploads s27', () => {
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('[data-cy=upload-s27]').should('be.enabled').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
  })
  it('conveyancer completes sale is unconditional', () => {
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('[data-cy=external-unconditional]').should('be.enabled').click()
    cy.get('#complete').should('be.enabled').click()
  })
  it('conveyancer sets the settlement date and time', () => {
    cy.wait(1000).visit('/properties')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('[data-cy=set-settlement-date]').last().should('be.enabled').click()
    cy.get('#settlement-date-picker')
      .clear()
      .type(moment().add(10, 'days').format('DDMMYYYY'))
    cy.get('[data-cy="set-time-date').click()
  })
  it('convenyacer sends notifications', () => {
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('#notification-buyer-alert').should('be.enabled').click()
    cy.get('#notification-buyer-sro').should('be.enabled').click()
  })
  it('uploads statement of adjustment', () => {
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('[data-cy=upload-soass]').should('be.enabled').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
  })
  it('PM approves of the SOA', () => {
    cy.visit('/properties')
    login(users.pm.username, users.pm.password)
    cy.get('.address > .MuiTypography-root').should('contain', address)
    cy.get('.address > .MuiTypography-root').click()
    cy.get('[data-cy=review-approve-soa]').should('be.enabled').click()
    cy.get('[data-cy=approve]').should('be.enabled').click()
    cy.get('[data-cy=review-approve-soa]').should('be.disabled')
  })
  it('conveyancer uploads statement of costs', () => {
    cy.wait(1000).visit('/properties')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('[data-cy=upload-stc]').should('be.enabled').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
  })
  it('conveyancer uploads the tax invoice', () => {
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('[data-cy=upload-tiv]').should('be.enabled').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
  })
  it('conveyancer completes ', () => {
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('#notification-final-inspection')
      .should('be.enabled')
      .last()
      .click()
      .should('be.disabled')
  })
})
