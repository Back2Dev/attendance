/* Pseudo code for Edit profile test
  * navigate to the kisok/volsignin page
  
  * login into the user
  * click on the edit profile button
  * click on one of the edit buttons
  * edit the data
  * click the update button
  */

describe('Edit member profile', function() {
  it('Selects a member and edits profile', function() {
    cy.visit('/admin/login')
    cy.get('input[name="email"]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get()
  })
})
