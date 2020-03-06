/* Pseudo code for member portal test
  * navigate to the kisok/volsignin page
  
  * go to the /add page
  * sign a user up with their email and password
  * click the submit button
  * check for the name and details of the user
  * check for the number of passes
  * check for the credit card button
  * click the update button
  
  */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
