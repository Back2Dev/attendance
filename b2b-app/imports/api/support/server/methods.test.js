import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { resetDatabase } from '/imports/api/cleaner'
import { Roles } from 'meteor/alanning:roles'
// import { Accounts } from 'meteor/accounts-base'
// import Members from '/imports/api/members/schema'
import '/imports/api/support/server/methods.js'
import '/server/methods'
import Factory from '/imports/test/factories.js'

const debug = require('debug')('app:support:test')

// Test Objects
const roles = ['CUS', 'CON']

describe('Users send support email', () => {
  before(function () {
    resetDatabase()
    roles.forEach((role) => {
      Roles.createRole(role)
    })
  })
  const theMethod = Meteor.server.method_handlers['support.create']
  it('should FAIL without valid params', () => {
    const thisContext = {
      userId: Random.id(),
    }
    const badParams = [
      {}, // just an empty object
      { subject: '' }, // empty subject
      { subject: 'some subject', message: '' }, // empty message
      { subject: ['a'], message: 5 }, // invalid message
    ]
    badParams.map((item) => {
      let result
      expect(() => {
        result = theMethod.apply(thisContext, [item])
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
  })
  it('should fail without login', () => {
    const thisContext = {} // no userId
    const aGoodParam = {
      subject: 'hello',
      message: 'some message',
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [aGoodParam])
    }).not.to.throw()
    // debug(result)
    expect(result).to.have.property('status').which.equal('failed')
    expect(result).to.have.property('message').which.equal('Please login')
  })
  it('should works with good param', () => {
    // create a new Meteor user
    const testUser = Factory.create('UserMEM')
    const thisContext = { userId: testUser._id } // no userId
    const aGoodParam = {
      subject: 'hello',
      message: 'some message',
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [aGoodParam])
    }).not.to.throw()
    // debug(result)
    expect(result).to.have.property('status').which.equal('success')
  })
})
