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
  before(async () => {
    await resetDatabase()
  })

  const theMethod = Meteor.server.method_handlers['profiles.addBadge']
  it('profiles.addBadge should return an object with status is failed with bad params', async () => {
    const badParams = [
      { profileId: 'some string' }, // missing code
      { code: 'some code' }, // missing profileId
    ]
    for (const item of badParams) {
      const thisContext = {
        userId: null,
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    }
  })
  it('profiles.addBadge should fail with not logged in user', async () => {
    const user = await Factory.createAsync('user')
    const member = await Profiles.findOneAsync({ userId: user._id })
    const theBadge = CONSTANTS.BADGES[0]
    const thisContext = {
      userId: null, // not logged in
    }
    let result
    result = await theMethod.apply(thisContext, [{ profileId: member._id, code: theBadge.code }])
    // debug(result)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('profiles.addBadge should work with admin user', async () => {
    const admin = await Factory.createAsync('UserADM')
    const user = await Factory.createAsync('user')
    const member = await Profiles.findOneAsync({ userId: user._id })
    const theBadge = CONSTANTS.BADGES[0]
    const thisContext = {
      userId: admin._id,
    }
    let result
    result = await theMethod.apply(thisContext, [{ profileId: member._id, code: theBadge.code }])
    debug(result)
    expect(result).to.have.property('status').which.equal('success')
  })
})
