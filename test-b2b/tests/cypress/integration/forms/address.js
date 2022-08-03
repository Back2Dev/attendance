Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})
describe('creates a form', () => {
  before(function () {
    freshDatabase()
  })
  it('logs in from hompage, creates a form with address input type', () => {
    cy.createBasicForm()
    cy.addInputField({
      title: 'Q',
      value: 'Address',
      type: 'text',
    })
    cy.addInputField({
      title: 'A',
      value: 'Enter address',
      type: 'address',
    })
    cy.get('.editorTools > span > button:nth-child(2)').click()

    // click next without any input
    cy.get('[data-cy=next-step]').click()
    cy.get('p#address-enter-address').should('exist')
    cy.get('[data-cy="next-step"]').should('be.disabled')

    // // give an invalid input
    // // This should work because, we don't want user to enter random text instead of valid address and they must select the address form the popup
    // cy.get('input#google-places-search').type('14 Ashley St, Reservoir, VIC, 3075')
    // cy.get('p#address-enter-address').should('exist')

    //   // give a valid input
    cy.get('#google-places-search-popup').should('not.exist')
    cy.get('input#google-places-search').type('14 Ashley St')
    cy.get('#google-places-search-popup').should('exist')
    cy.get('[id="google-places-search-option-0"]').click()

    cy.get('p#address-enter-address').should('not.exist')
    cy.get('[data-cy="next-step"]').click()
    cy.get('[data-cy=completed]').should('exist')
  })
})
