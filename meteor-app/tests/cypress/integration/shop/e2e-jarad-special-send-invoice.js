describe('Send invoice to Tough Guy', function() {
  it('Create a member, and send an invoice email', function() {
    cy.visit('/admin/userprofiles/')
    mkToughGuy()

    cy.get('input[name=email]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name=password]')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()
    cy.get('button[about="Tough Guy"]')
      .contains('Add...')
      .click()
    cy.get('button#multi_pass')
      .contains('Multi pass')
      .should('exist')
      .click()
    cy.get('button#pa_casual_session')
      .should('exist')
      .click()
    //
    // At this point the cart is set up, and in sessionStorage
    // So we save the details to a fixtures file, which is read
    // by another test script (e2e-tough-guy-purchase.js)
    //
    cy.window().then(window => {
      const contents = {
        memberId: window.sessionStorage.getItem('memberId'),
        cartId: window.sessionStorage.getItem('mycart')
      }
      cy.writeFile('tests/cypress/fixtures/tough-guy-cart.json', contents)
    })

    cy.get('button#checkout')
      .should('exist')
      .click()
    // Admin promo code brings up form
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
      .type('JARAD-ROOLS')
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('input[value="email"]')
      .should('exist')
      .click()
    cy.get('input[type="email"]').should('have.value', 'tough.guy@tough-guys.inc.inc')
    cy.get('button[id="doit"]')
      .should('exist')
      .click()
    cy.get('h2[class="ui header"').contains('tough.guy@tough-guys.inc.inc')
    //
    // At this point, we have sent an email to the member
    // But before we go, go to the users admin page and check that the cart
    // is setup for the member
    //
    cy.visit('/admin/userprofiles/')
    cy.get('div[class="content"]')
      .contains('Tough Guy')
      .should('exist')
      .click()
    cy.get('div[class="content"]')
      .contains('1 x PA-CASUAL')
      .should('exist')
    //
    // Our work as administrator is done, so sign off
    //
    cy.visit('/signout')
    cy.log('To be continued in e2e-tough-guy-purchase.js')
  })
})
