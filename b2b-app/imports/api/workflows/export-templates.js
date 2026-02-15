const templates = {
  header: `
import { DateTime } from 'luxon'
import '/tests/cypress/support/actions'
import { cathyCustomer, conveyancer, pm } from '/tests/cypress/fixtures/users.json'
import listings from '/tests/cypress/fixtures/listings'
const listing = listings.easy
const context = {
  users: {
    CUS: cathyCustomer,
    CON: conveyancer,
    PM: pm
  },
  listing,
  address: listing.address,
  short: listing.shortAddress,
}
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
  beforeEach(function () {})

  it('Adds a property from the dashboard as a customer', function () {
    cy.loginFromHomepage(context.users.CUS.username, context.users.CUS.password)
    cy.get('[data-cy=add-btn]').should('exist').click()
    cy.AddAddress(listing.address, '[name=address]')
    cy.get('[value="buy"]').should('exist').click()
    cy.get('#uniforms-0000-0004 > :nth-child(2)').click()
    cy.get('[data-cy=addproperty-submit]').click()
  })
  it('checks if the property exists in the PM property page', function () {
    cy.PMDispatcher({pm, shortAddress:  listing.shortAddress})
  })
})

describe('Walk through next steps', () => {
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  })
`,
  footer: `
    }) // Close the it block
  }) // Close the describe block

`,
  logout: `
})
`,
  login: `
  it('{{role}}: {{name}}', function () {
    loginToNextStep(context.users.{{role}}.username, context.users.{{role}}.password, context.short)

`,
  loginCUS: `
  it('{{role}}: {{name}}', function () {
    cy.loginToCustProperty(context.users.{{role}}.username, context.users.{{role}}.password, context.short)

`,
  assign: `// {{role}} Assign: {{name}} ({{slug}})
  cy.ActionAssign({slug: '{{slug}}', role: '{{role}}',...context})

`,
  upload: `// {{role}} Upload: {{name}} ({{slug}})
  cy.ActionUpload({slug: '{{slug}}', role: '{{role}}',...context})

`,
  approve: `// {{role}} Approve: {{name}} ({{slug}})
  cy.ActionApprove({slug: '{{slug}}', role: '{{role}}',...context})

`,
  notification: `// {{role}} Notify: {{name}} ({{slug}})
  cy.ActionNotification({slug: '{{slug}}', role: '{{role}}',...context})

`,
  webform: `// {{role}} Webform: {{name}} ({{slug}})
  cy.ActionWebform({slug: '{{slug}}', role: '{{role}}',...context})

`,
  nextstage: `// {{role}} Next stage: {{name}} ({{slug}})
  cy.ActionNextStage({slug: '{{slug}}', role: '{{role}}',...context})

`,
  sign: `// {{role}} Sign: {{name}} ({{slug}})
  cy.ActionSign({slug: '{{slug}}', role: '{{role}}',...context})

`,
  external: `// {{role}} External: {{name}} ({{slug}})
  cy.ActionExternal({slug: '{{slug}}', role: '{{role}}',...context})

`,
  bot: `// {{role}} Robot: {{name}} ({{slug}})
  cy.ActionBot({slug: '{{slug}}', role: '{{role}}',...context})

`,
  voi: `// {{role}} VOI: {{name}} ({{slug}})
  cy.ActionVoi({slug: '{{slug}}', role: '{{role}}',...context})

`,
  ['set-date-time']: `// {{role}} Date/time: {{name}} ({{slug}})
  cy.ActionSetDateTime({slug: '{{slug}}', role: '{{role}}',...context})

`,
}
export default templates
