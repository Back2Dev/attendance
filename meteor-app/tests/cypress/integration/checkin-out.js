
describe('Checkin', function() {
  beforeEach(function(){
    cy.visit('/')
    loadFixtures()
  })
})

describe('Checking in', function() {
  beforeEach(function(){
    cy.visit('/')
    loadFixtures()
  })
  it('Allows checkin', function() {
    cy.contains('Dorothea Kovacek')
      .click()
    cy.get('input#pin')
      .type('1234')
    cy.get("#signIn")
      .click()
  })
  it('Allows checkout', function() {
    cy.contains('Dorothea K')
      .click()
    cy.get('input#pin')
      .type('1234')
    cy.get("#signIn")
      .click()
  })
})



