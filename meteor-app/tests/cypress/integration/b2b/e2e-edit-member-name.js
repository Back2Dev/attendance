import editMem from '../../support/test-data-edit-profile'

/* Pseudo code for Edit profile  and name test
  * navigate to the kisok/volsignin page
  
  * login into the user
  * click on the edit profile button
  * click on one of the edit buttons
  * edit the member name
  * click the update button
  * go back into the  data to check if it is changed
  */

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Create an Cathrine King', function() {
  it(`Creates an Cathrine`, function() {
    cy.visit('/')
    addCathrine()
  })
})

describe('Edit member profile', function() {
  it('Selects a member and edits profile', function() {
    cy.visit('/login')
    cy.get('input[name="email"]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name="password"]')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

    cy.get('a[href="/volsignin"]').click()
    cy.get('[type="text"]').should('exist')

    cy.get('div')
      .contains(editMem.memberName)
      .should('exist')

    cy.contains(editMem.memberName).click()

    cy.get('input[name="pinInput"]')
      .should('exist')
      .clear()
      .type(editMem.pinNo)

    cy.get('button')
      .contains('Edit your profile')
      .should('exist')
      .should('be.enabled')
      .click()

    cy.get('#edit-contact')
      .should('exist')
      .click()

    cy.get('input[id="root_name"]')
      .clear({ force: true })
      .type(editMem.newmemberName)

    cy.get('#root_pin')
      .clear({ force: true })
      .type('1234')

    cy.get('button[type="submit"]')
      .contains('Update')
      .should('exist')
      .should('be.enabled')
      .click({ force: true })

    cy.get('#edit-contact')
      .should('exist')
      .click()

    cy.get('#root_pin')
      .clear()
      .type('2701')

    cy.get('#root_name')
      .clear({ force: true })
      .type(editMem.memberName)

    cy.get('button[type="submit"]')
      .contains('Update')
      .should('exist')
      .should('be.enabled')
      .click()

    cy.get('#edit-contact')
      .should('exist')
      .click()

    cy.get('#root_name').should('have.value', editMem.memberName)
  })
})
