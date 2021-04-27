import users from '/tests/cypress/fixtures/users.json'
import 'cypress-file-upload'
const profilePic = '../fixtures/profilepicadmin.jpg'
let currPasswd = users.admin.password

Cypress.on(
  'uncaught:exception',
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test. We do this because of some ugly js errors
    // from a js library we are using
    false
)

describe('Testing user profile functions', () => {
  before(function () {
    freshDatabase()
  })
  beforeEach(() => {
    cy.loginFromHomepage(users.admin.username, currPasswd)
    cy.get('a[href="/properties"]')
    cy.get('[data-cy=primary-search-account-menu]').first().click()
    cy.get('#primary-search-account-menu > .MuiPaper-root > .MuiList-root').should(
      'exist'
    )
    cy.get('[data-cy=a-tag-profile]').click()
  })
  it('goes to the profile section and updates the users details', () => {
    cy.get('[data-cy=user-account]').should('exist').should('contain', 'User profile')
    cy.get('form').should('exist')
    cy.get('input[name="name"]').clear().type(users.admin.name)
    cy.get('input[name="nickname"]').clear().type(users.admin.nickname)
    cy.get('input[type="tel"]').should('exist').type(users.admin.phone).blur()
    cy.get('#next-button').click()
    cy.get('.Toastify__toast-body').should('exist').should('contain', 'Member updated')
  })
  it("changes the user's password", () => {
    cy.contains('Password').should('exist').click()
    cy.get('#old-password').should('exist').type(users.admin.password)
    cy.get('[data-cy=old-password-submit]').should('exist').click()
    // cy.get('input[name="password"]')
    cy.get('#new-password').should('exist').type(users.admin.newPassword)
    cy.get('#confirm').should('exist').type(users.admin.newPassword)
    // Update the password we are using...
    currPasswd = users.admin.newPassword
    cy.get('#next-button').should('exist').click()
    cy.get('.Toastify__toast-body').should('contain', 'Changed password')
  })
  it('it uploads an image', () => {
    cy.contains('Photo').should('exist').click()
    cy.get('[data-cy=upload-profile-pic]').should('exist').attachFile(profilePic)
    cy.get('[data-cy=save-profile-pic]').click()
    cy.get('.Toastify__toast-body').should('contain', 'upload successful')
  })
  it("changes the user's password back", () => {
    cy.contains('Password').should('exist').click()
    cy.get('#old-password').should('exist').type(currPasswd)
    cy.get('[data-cy=old-password-submit]').should('exist').click()
    // cy.get('input[name="password"]')
    cy.get('#new-password').should('exist').type(users.admin.password)
    cy.get('#confirm').should('exist').type(users.admin.password)
    // Update the password we are using...
    currPasswd = users.admin.password
    cy.get('#next-button').should('exist').click()
    cy.get('.Toastify__toast-body').should('contain', 'Changed password')
  })
  it('uploads a signature successfully', () => {
    cy.contains('Signature').should('exist').click()
    cy.get('[data-cy=signCanvas]').should('exist').click()
    cy.get('#save-button').should('exist').click()
  })
})
