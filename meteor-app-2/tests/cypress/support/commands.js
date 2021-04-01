// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload'

//Pull in any environment variables
const env = Cypress.env()
// Supply defaults, just in case
const defEnv = {
  bucket: 'random.dev.se.com.au',
}
Object.keys(defEnv).forEach((key) => {
  if (!env[key]) env[key] = defEnv[key]
})

// Login from the login screen
Cypress.Commands.add('loginFromHomepage', (username, password) => {
  cy.visit('/login')
  cy.get('#login-nav-item').contains('Log in').click()
  cy.get('[data-cy=email-input]').type(username)
  cy.get('[data-cy=password-input]').type(password)
  cy.get('[data-cy=login-btn]').should('be.enabled').click()
})

// Adds an address into the address input
Cypress.Commands.add('AddAddress', (address, name) => {
  if (!name) {
    return cy
      .get('#google-places-search')
      .type(address)
      .blur()
      .should('have.attr', 'value', address)
  }
  return cy.get(name).type(address).blur().should('have.attr', 'value', address)
})

// Presses the next button on a webform
Cypress.Commands.add('WebformPressNext', () => {
  return cy.get('.next').last().should('be.enabled').click()
})

// Previews and submits the weform
Cypress.Commands.add('SubmitWebform', (signed) => {
  cy.get('[data-cy=preview-btn]')
    .as('previewBtn')
    .invoke('text')
    .should('contain', 'Preview')
  cy.get('@previewBtn').click().wait(2000)
  cy.get('[data-cy=submit-webform]').should('exist')
  if (signed) {
    cy.get('#sign').should('exist').click()
  }
  cy.get('span#zoom-title').should('exist')
  cy.get('[data-cy=submit-webform]').should('be.enabled').click()
})

// Uploads the document in upload component in next-steps
Cypress.Commands.add('UploadDocument', (file, hasButton) => {
  cy.get('[data-cy=upload-input]').should('exist').attachFile(file)
  if (hasButton) {
    cy.get('[data-cy=submit-uploader]').should('be.enabled').click()
  }
  cy.intercept('POST', `/${env.bucket}`).as('slingshot')
  // Wait for the file upload to complete
  cy.wait('@slingshot')
})

// Approves a document in next-steps
Cypress.Commands.add('ApproveDocument', (element) => {
  cy.get(element).should('be.enabled').click()
  cy.wait(2000).get('[data-cy=approve]').should('be.enabled').click()
})

Cypress.Commands.add('AssignConveyancer', () => {
  cy.get('#assign-btn').should('be.enabled').click()
  cy.get('#conveyancer-select').type('Constantine').type('{downarrow}').type('{enter}')
  cy.get('#assign-con-btn').should('exist').click()
  cy.get('#assign-btn').should('contain', 'Reassign')
})

Cypress.Commands.add('CompleteCostDisclosure', (username, address) => {
  cy.get('#start-webform').should('be.enabled').click()
  cy.WebformPressNext()
  cy.get('#customer-email').as('cusEmail').clear().type(username).blur()
  cy.get('@cusEmail').should('have.attr', 'value', username)
  cy.AddAddress(address, '[name=customer-residential]')
  cy.WebformPressNext()
  cy.get('#certificate-volume')
    .clear()
    .type('00000')
    .should('have.attr', 'value', '00000')
  cy.get('#certificate-folio').clear().type('000').should('have.attr', 'value', '000')
  cy.WebformPressNext()
  cy.get('#invoice-cost').should('have.attr', 'value', '600')
  cy.get('#invoice-disbursements').clear().type('0').should('have.attr', 'value', '0')
  cy.WebformPressNext()
  cy.SubmitWebform(true)
  cy.get('[data-cy=webform-cost-disclosure]').should('be.disabled')
})

Cypress.Commands.add('PMApproveCDC', (username, name, address) => {
  cy.get('#start-webform').should('be.enabled').click()
  cy.get('#practice-name').should('have.attr', 'value', 'Settle Easy VIC')
  cy.get('[name=practice-address]').should(
    'have.attr',
    'value',
    'Level 6, 530 Collins St, Melbourne, VIC 3000'
  )
  cy.get('#practice-abn').should('have.attr', 'value', '20 625 000 651')
  cy.get('#practice-license').should('have.attr', 'value', '001632L')
  cy.WebformPressNext()
  cy.get('#customer-name').should('have.attr', 'value', name)
  cy.get('#customer-email').should('have.attr', 'value', username)
  cy.get('[name=customer-residential]').should('have.attr', 'value', address)
  cy.WebformPressNext()
  cy.get('[name=customer-residential]').should('have.attr', 'value', address)
  cy.WebformPressNext()
  cy.get('#invoice-cost').should('have.attr', 'value', '600')
  cy.get('#invoice-disbursements').should('have.attr', 'value', '0')
  cy.WebformPressNext()
  cy.get('[data-cy=preview-btn]')
    .as('previewBtn')
    .invoke('text')
    .should('contain', 'Preview')
  cy.get('@previewBtn').click()
  cy.get('[data-cy=submit-webform]').should('be.enabled').click()
})

Cypress.Commands.add('CompleteClientAuth', (name, address) => {
  cy.get('#start-webform').should('be.enabled').click()
  // STEP 1 - PRIVACY
  cy.WebformPressNext()
  cy.get('#client-name').clear().type(name)
  cy.AddAddress(address, '[name=client-address]')
  cy.WebformPressNext()

  // STEP 3 - TRANSACTION DETAILS
  cy.get('[name="authority"][value="standing"]').click()
  cy.WebformPressNext()

  // STEP 4 - CONVEYANCING TRANSACTION(S)
  cy.get('#land-titleref').clear().type('00000/000')
  cy.get('input#transaction-mortgage').click()
  cy.WebformPressNext()

  // PREVIEW AND SUBMIT
  cy.SubmitWebform()
})

Cypress.Commands.add('PMReviewCAF', (name, address) => {
  cy.get('#start-webform').should('be.enabled').click()
  cy.WebformPressNext()
  cy.get('#client-name').should('have.attr', 'value', name)
  cy.get('#google-places-search').should('have.attr', 'value', address)
  cy.WebformPressNext()
  cy.get('input[value="standing"]').should('be.checked')
  cy.WebformPressNext()
  cy.get('#google-places-search').should('have.attr', 'value', address)
  cy.WebformPressNext()

  cy.SubmitWebform()
})

Cypress.Commands.add('PMDispatcher', (username, password, address) => {
  cy.visit('/properties')
  login(username, password)
  cy.get('.address > .MuiTypography-root').should('contain', address).click()
  cy.get('[data-cy=success]').should('exist')
  cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
  cy.get('[name="referralSource"]').should('exist').clear().type('Barry Plant')
  cy.get('#cost-adorment-cost').should('exist').clear().type('660')
  cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
  cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
  cy.get('[data-cy=dispatch-next]').should('exist').click({ force: true })
  cy.get('[data-cy=launch-job]').should('exist').click()
})

Cypress.Commands.add('manualLogin', (person) => {
  cy.get('[data-cy=email-input]').should('exist').type(person.username)
  cy.get('[data-cy=password-input]').should('exist').type(person.password)
  cy.get('[data-cy=login-btn]').click()
})

Cypress.Commands.add('SendNotification', (element) => {
  cy.get(element).should('be.enabled').click({ force: true })
  // Checks if button is disabled on next-steps
  cy.get(element).should('be.disabled')
})
