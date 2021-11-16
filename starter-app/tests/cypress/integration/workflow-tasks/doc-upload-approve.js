import 'cypress-fill-command'
import users from '/tests/cypress/fixtures/users.json'
import listings from '/tests/cypress/fixtures/listings'
const address = listings.easy.address

const env = Cypress.env()
// Supply defaults, just in case
const defEnv = {
  bucket: 'random.dev.se.com.au',
}
Object.keys(defEnv).forEach((key) => {
  if (!env[key]) env[key] = defEnv[key]
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are    using
  return false
})

describe('Sellers questionnaire web form (mini-workflow)', () => {
  before(function () {
    freshDatabase()
    cy.window().then(async (win) => {
      await win.Meteor.callAsync('cleanup.listing', listings.easy.address)
    })
    cy.wait(4000)
  })
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
  })
  it('Adds a property and uploads a document (cos)', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.window().then(async (win) => {
      listings.easy.slug = 'test-approve'
      const response = await win.Meteor.callAsync('launch.job', listings.easy)
    })
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    // cy.UploadDocument()
    cy.get('[data-cy=upload-cos]').should('exist').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
    cy.intercept('POST', `/${env.bucket}`).as('slingshot')
    // Wait for the file upload to complete
    cy.wait('@slingshot')
    cy.get('[data-cy=review-approve-cos]').should('be.disabled')
  })

  it('Rejects the document (cos)', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.mgr.username, users.mgr.password)
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })

    cy.get('[data-cy=review-approve-cos]').click()
    // DECLINE IT FIRST TIME AROUND
    cy.get('[data-cy=decline]').click()
    cy.get('a[href="/properties"]').should('exist')
    cy.get('[data-cy=review-approve-cos]').should('exist')
  })

  it('Re-uploads the document (cos)', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })

    cy.get('[data-cy=upload-cos]').should('exist').click()
    cy.get('[data-cy=upload-input]').should('exist').attachFile('contract.pdf')
    cy.get('[data-cy=submit-uploader]').click()
    cy.intercept('POST', `/${env.bucket}`).as('slingshot')
    // Wait for the file upload to complete
    cy.wait('@slingshot')
    cy.get('[data-cy=review-approve-cos]').should('be.disabled')
  })

  it('Approves the document (cos)', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.mgr.username, users.mgr.password)
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })

    cy.get('[data-cy=review-approve-cos]').click()
    // APPROVE IT 2ND TIME AROUND
    cy.get('[data-cy=approve]').click()
    cy.get('[data-cy=external-finished]').should('be.disabled')
  })

  it('Customer skips the approval (cos)', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    // Skip
    cy.get('button#skip-cust-approve').click()
    // Confirm
    cy.get('button#yes-skip').click()
  })

  it('Completes the "Finished" task', () => {
    cy.visit('/properties')
    cy.get('h1').should('contain', 'Log in')
    login(users.conveyancer.username, users.conveyancer.password)
    cy.wait(400)
    cy.get('h1').contains('My properties').should('exist')
    cy.get('a[href="/properties"]').should('exist').click()
    cy.get('.address > a').then((element) => {
      cy.wrap(element).invoke('text').should('contain', address)
      cy.wrap(element).click()
    })
    cy.get('[data-cy=external-finished]').should('exist').click()
    cy.get('h1').contains('Finish').should('exist')
    cy.get('input#done').should('exist').click()
    cy.get('button#complete').should('exist').click()
    // Wait for confirmation of the step being completed
    cy.get('div.MuiCardHeader-root').contains('Finish').should('exist')
  })
})
