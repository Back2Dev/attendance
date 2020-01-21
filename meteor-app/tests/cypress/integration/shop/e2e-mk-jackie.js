import moment from 'moment'
import faker from 'faker'

describe('Create a Jackie Chan', function() {
  it(`Creates a Jackie`, function() {
    cy.visit('/')
    addJackie()
  })
})
