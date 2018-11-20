
describe('Setup', function() {
  beforeEach(function(){
    cy.visit('/')
    loadFixtures()
    rmPin('Dorothea Kovacek')
  })
})

const pin = '1234'

describe('Checking in', function() {
  beforeEach(function(){
    cy.visit('/')
    loadFixtures()
  })
  it('Allows checkin', function() {

    rmPin('Dorothea Kovacek')
    cy.contains('Dorothea Kovacek')
      .click()
// Create a PIN for the user
    cy.get("#createPIN")
      .click()
    cy.get('input#pin1')
      .type(pin)
    cy.get('input#pin2')
      .type(pin)
    cy.get("#setPIN")
      .click()
// // Enter the PIN
//     cy.get('input#pin')
//       .type(pin)
    cy.get("#signIn")
      .click()
  })
  it('Allows checkout', function() {
    cy.contains('Dorothea K')
      .click()
    cy.get('input#pin')
      .type(pin)
    cy.get("#signIn")
      .click()
  })
})



