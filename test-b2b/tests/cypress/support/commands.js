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

Cypress.Commands.add('createBasicForm', () => {
  cy.visit('/')
  cy.loginFromHomepage('mike.king@mydomain.com.au', 'me2')
  cy.visit('/admin/forms')
  cy.get('#add').click()
  cy.get('[name=name]').clear().type('Test')
  cy.get('[name=slug]').clear().type('test-101')
  cy.get('[name=source]').clear().type(`
  S Test ${'\n'}
    `)

  cy.get('[name=revision]').clear().type('1')
  cy.get('[name=active]').click()
  cy.get('button[type=submit]').click()
  cy.visit('/admin/forms/edit/test-101')
  cy.get('.editorTools > span > button:nth-child(2)').click()
  cy.get('.CodeMirror textarea').type(`\n`, {
    force: true,
  })
})

Cypress.Commands.add('addInputField', (data = {}) => {
  let { title, value, type, id, optional } = data
  cy.get('.CodeMirror textarea')
    // we use `force: true` below because the textarea is hidden
    // and by default Cypress won't interact with hidden elements
    .type(
      `${title ? title : ''} ${value ? value + '\n' : ''}${
        type ? '+type=' + type + '\n' : ''
      }${id ? '+id=' + id + '\n' : ''}${optional ? '+type=optional\n' : ''}`,
      {
        force: true,
      }
    )
})

Cypress.Commands.add('getSettled', (selector, opts = {}) => {
  /**
   * Resolves issue where element is detached DOM
   * USAGE:
   * cy.getSettled(`button`, { retries: 2, delay: 500 }).click();
   * OR
   * cy.getSettled(`button`).click();
   */
  const retries = opts.retries || 3
  const delay = opts.delay || 100
  cy.log(selector)

  const isAttached = (resolve, count = 0) => {
    const el = Cypress.$(selector)
    // is element attached to the DOM?
    count = Cypress.dom.isAttached(el) ? count + 1 : 0

    // hit our base case, return the element
    if (count >= retries) {
      return resolve(el)
    }

    // retry after a bit of a delay
    setTimeout(() => isAttached(resolve, count), delay)
  }

  // wrap, so we can chain cypress commands off the result
  return cy.wrap(null).then(() => {
    return new Cypress.Promise((resolve) => {
      return isAttached(resolve, 0)
    }).then((el) => {
      return cy.wrap(el)
    })
  })
})
