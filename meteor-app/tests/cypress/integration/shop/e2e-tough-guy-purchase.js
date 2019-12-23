describe('Tough Guy makes a purchase', function() {
  it('Make like we clicked the link in the invoice email', function() {
    cy.visit('/')
    //
    // Load up the fixture data, which references the member and the cart
    //
    cy.fixture('tough-guy-cart').then(guy => {
      cy.log(`member/cart ${guy.memberId}/${guy.cartId}`)
      cy.visit(`/shop/renew/${guy.memberId}/${guy.cartId}`)
      cy.get('button')
        .contains('Next')
        .click()
      // More to be written here...
    })
  })

  // We won't remove the tough guy at the end, because it is convenient to be able
  // to look at the data afterwards
  // rmToughGuy()
})
