import moment from 'moment'
import faker from 'faker'

describe('Create a Jackie Chan', function() {
  it(`Creates a Jackie`, function() {
    cy.visit('/')
    addJackie()
  })
})

describe('Create a Bruce Lee', function() {
  it(`Creates a Bruce`, function() {
    cy.visit('/')
    addBruce()
  })
})

describe('Create a Tough Guy', function() {
  it(`Creates a Tough`, function() {
    cy.visit('/')
    addTough()
  })
})

describe('Create an Eddie Mercx', function() {
  it(`Creates an Eddie`, function() {
    cy.visit('/')
    addEddie()
  })
})

describe('Create an Rookie Paddler', function() {
  it(`Creates an Rookie`, function() {
    cy.visit('/')
    addRookie()
  })
})
