import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'

import { expect } from 'chai'

import Factory from '/imports/test/factories'
import Profiles from '/imports/api/profiles/schema.js'
import CONSTANTS from '/imports/api/constants'
import './methods'

const debug = require('debug')('app:profiles:test')

// Tests start here

// prepare data for testing

describe('Test profiles.addBadge methods', () => {
  before(() => {
    resetDatabase()
  })

  const theMethod = Meteor.server.method_handlers['profiles.addBadge']
  it('profiles.addBadge should return an object with status is failed with bad params', () => {
    const badParams = [
      { profileId: 'some string' }, // missing code
      { code: 'some code' }, // missing profileId
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
  it('profiles.addBadge should fail with not logged in user', () => {
    const user = Factory.create('user')
    const member = Profiles.findOne({ userId: user._id })
    const theBadge = CONSTANTS.BADGES[0]
    const thisContext = {
      userId: null, // not logged in
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [
        { profileId: member._id, code: theBadge.code },
      ])
    }).not.to.throw()
    // debug(result)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('profiles.addBadge should work with admin user', () => {
    const admin = Factory.create('UserADM')
    const user = Factory.create('user')
    const member = Profiles.findOne({ userId: user._id })
    const theBadge = CONSTANTS.BADGES[0]
    const thisContext = {
      userId: admin._id,
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [
        { profileId: member._id, code: theBadge.code },
      ])
    }).not.to.throw()
    debug(result)
    expect(result).to.have.property('status').which.equal('success')
  })
})
