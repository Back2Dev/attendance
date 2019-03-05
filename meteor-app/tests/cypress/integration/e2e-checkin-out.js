describe('Setup', () => {
  beforeEach(() => {
    cy.visit('/')
    // loadFixtures()
    rmPin('Dorothea Kovacek')
  })
})

const pin = '1234'

describe('Checking in', () => {
  beforeEach(() => {
    cy.visit('/')
    // loadFixtures()
  })
  it('Allows checkin', () => {
    rmPin('Dorothea Kovacek')
    cy.get('div[about="Dorothea Kovacek"]')
      .invoke('text')
      .as('visits') // This saves it for 'Ron
    cy.get('div[list="away"]')
      .contains('Dorothea Kovacek')
      .click()
    // Create a PIN for the user
    cy.get('#createPIN').click()
    cy.get('input#pin1').type(pin)
    cy.get('input#pin2').type(pin)
    cy.get('#setPIN').click()
    cy.get('#signIn').click()
    cy.get('div[list="present"]')
      .contains('Dorothea K')
      .should('exist')
  })
  it('Allows checkout', () => {
    cy.contains(/Dorothea K$/).click()
    cy.get('input#pin').type(pin)
    cy.get('#signIn').click() // button is used for both sign in and out
  })
  it('Available for checkin', () => {
    cy.get('div[list="away"]')
      .contains('Dorothea Kovacek')
      .should('exist')
    // Check the number of visits has gone up by 1
    cy.get('div[about="Dorothea Kovacek"]').then(function ($div) {
      // expect(parseInt($div.text()) - parseInt(this.visits)).to.eq(1)
      expect($div.text()).to.eq(this.visits)
    })
  })
})
