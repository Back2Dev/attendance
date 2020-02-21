/* Pseudo code for Edit profile test
  * navigate to the kisok/volsignin page
  
  * login into the user
  * click on the edit profile button
  * click on one of the edit buttons
  * edit the data
  * click the update button
  */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Edit member profile', function() {
  it('Selects a member and edits profile', function() {
    cy.visit('/login')
    loginAsAdmin()
  })
})
