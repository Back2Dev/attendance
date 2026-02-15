import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Factory from '/imports/test/factories'
import { listingSettleComplete } from './utils'
import Profiles from '../../profiles/schema'
import { getUserEmailAddress } from '../../users/utils'

const debug = require('debug')('app:listing-server-utils-test')

describe('Test listingSettleComplete utils function', () => {
  it('should FAIL without valid params', async () => {
    const badParams = [
      {}, // just an empty object
      [], // not a string
      'not matched string',
    ]
    await Promise.all(
      badParams.map(async (item) => {
        let result
        try {
          result = await listingSettleComplete(item)
        } catch (e) {
          expect(e).not.to.be.instanceOf(Error)
        }
        debug('invalid params result', result)
        expect(result).to.have.property('status').which.equal('failed')
      })
    )
  })
  it('should work with valid listing id', async () => {
    const testCusProfile = await Factory.createAsync('ProfilePART')
    const testPartUser = await Meteor.users.findOneAsync({ _id: testCusProfile.userId })
    // create workflow
    await Factory.createAsync('vic-buy')
    // create listing
    const persons = [
      {
        userId: testPartUser._id,
        name: testCusProfile.name,
        mobile: testCusProfile.mobile,
        email: getUserEmailAddress(testPartUser),
        role: 'PART',
      },
    ]
    const listing = await Factory.createAsync('listings', { persons })

    let result
    try {
      result = await listingSettleComplete(listing._id)
    } catch (e) {
      expect(e).not.to.be.instanceOf(Error)
    }
    debug('should work', result)
    expect(result).to.have.property('status').which.equal('success')
  })
})
