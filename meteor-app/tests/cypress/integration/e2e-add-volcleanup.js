describe('Clean up', function() {
  it('Remove eddies', function() {
    beforeEach(function() {
      cy.visit('/')
      loadFixtures()
      rmEddie()
    })
  })
})
