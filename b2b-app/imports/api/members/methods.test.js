import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'

import { expect } from 'chai'

import Factory from '/imports/test/factories'
import Members from '/imports/api/members/schema.js'
import CONSTANTS from '/imports/api/constants'
import './methods'

const debug = require('debug')('b2b:members:test')

// Tests start here

// prepare data for testing

describe('Test members.addBadge methods', () => {
  before(() => {
    resetDatabase()
  })

  const theMethod = Meteor.server.method_handlers['members.addBadge']
  it('members.addBadge should return an object with status is failed with bad params', () => {
    const badParams = [
      { memberId: 'some string' }, // missing code
      { code: 'some code' }, // missing memberId
    ]
    badParams.map((item) => {
      const thisContext = {
        userId: null,
      }
      let result
      expect(() => {
        result = theMethod.apply(thisContext, [item])
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
  })
  it('members.addBadge should fail with not logged in user', () => {
    const user = Factory.create('user')
    const member = Members.findOne({ userId: user._id })
    const theBadge = CONSTANTS.BADGES[0]
    const thisContext = {
      userId: null, // not logged in
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [
        { memberId: member._id, code: theBadge.code },
      ])
    }).not.to.throw()
    // debug(result)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('members.addBadge should work with admin user', () => {
    const admin = Factory.create('UserADM')
    const user = Factory.create('user')
    const member = Members.findOne({ userId: user._id })
    const theBadge = CONSTANTS.BADGES[0]
    const thisContext = {
      userId: admin._id,
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [
        { memberId: member._id, code: theBadge.code },
      ])
    }).not.to.throw()
    debug(result)
    expect(result).to.have.property('status').which.equal('success')
  })
})
