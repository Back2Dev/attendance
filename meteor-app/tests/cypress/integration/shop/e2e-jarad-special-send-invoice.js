// ratPack is in cypress/support/index.js

describe('Send invoice to people in ratPack', function() {
  it('Create a member, and send an invoice email', function() {
    ratPack.forEach(data => {
      cy.visit('/admin/userprofiles/')
      mkFakeUser(data.name)

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
      cy.get(`button[about='${data.name}']`)
        .contains('Add...')
        .click()
      cy.get(`button#${data.memberType[0].replace(/ /g, '_').toLowerCase()}`)
        .contains(`${data.memberType[0]}`)
        .should('exist')
        .click()
      cy.get(`button#${data.memberType[1].replace(/ /g, '_').toLowerCase()}`)
        .should('exist')
        .click()
      //
      // At this point the cart is set up, and in sessionStorage
      // So we save the details to a fixtures file, which is read
      // by another test script (e2e-purchase.js)
      //
      cy.window().then(window => {
        const contents = {
          memberId: window.sessionStorage.getItem('memberId'),
          cartId: window.sessionStorage.getItem('mycart')
        }
        cy.writeFile(`tests/cypress/fixtures/${data.name.replace(/ /g, '-')}-cart.json`.toLowerCase(), contents)
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
      cy.get('input[type="email"]').should(
        'have.value',
        `${data.name.replace(/ /g, '.')}@${data.name.replace(/ /g, '-')}s.inc.inc`.toLowerCase()
      )
      cy.get('button[id="doit"]')
        .should('exist')
        .click()
      cy.get('h2[class="ui header"').contains(
        `${data.name.replace(/ /g, '.')}@${data.name.replace(/ /g, '-')}s.inc.inc`.toLowerCase()
      )
      //
      // At this point, we have sent an email to the member
      // But before we go, go to the users admin page and check that the cart
      // is setup for the member
      //
      cy.visit('/admin/userprofiles/')
      cy.get('div[class="content"]')
        .contains(data.name)
        .should('exist')
        .click()
      cy.get('div[class="content"]')
        .contains(`1 x PA-${data.memberType[1].includes('membership') ? 'MEMB' : 'CASUAL'}`)
        .should('exist')
      //
      // Our work as administrator is done, so sign off
      //
      cy.visit('/signout')
      cy.wait(1000)
      cy.log('To be continued in e2e-purchase.js')
    })
  })
})
