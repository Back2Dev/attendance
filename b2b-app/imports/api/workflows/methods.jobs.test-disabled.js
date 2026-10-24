import { expect } from 'chai'
import { Random } from 'meteor/random'
import Profiles from '/imports/api/profiles/schema'
import '/imports/api/workflows/methods-basic'
// import '/imports/api/users/server/publications'
import Factory from '../../test/factories'
import './methods.jobs'
import { callAsyncStubbed } from '/imports/test/util'
import { getUserEmailAddress } from '../users/utils'
import { expectNotToThrowError } from '/imports/test/chai-expect-throw-error'

const debug = require('debug')('app:workflows-tasks-test')

const fakeUser = { _id: '1234', userId: '1234' }

context('Job methods', function () {
  describe('Test rm.job method', () => {
    it('should FAIL without valid params', async function () {
      const badParams = [
        {}, // just an empty object
        { id: '2' }, // missing reason
        { id: 2, reason: 'some thing' }, // bad id
      ]
      for (const item of badParams) {
        const result = await expectNotToThrowError(async () => {
          return await callAsyncStubbed(fakeUser, 'rm.job', item)
        })
        debug('invalid params result', result)
        expect(result).to.have.property('status').which.equal('failed')
      }
    })
    it('should FAIL without login', async function () {
      const result = await expectNotToThrowError(async () => {
        return await callAsyncStubbed({}, 'rm.job', { id: Random.id(), reason: 'test' })
      })
      debug('not logged in result', result)
      expect(result).to.have.property('status').which.equal('failed')
    })
    it('should FAIL without ADM role', async function () {
      const testCus = await Factory.createAsync('UserPART')
      const result = await expectNotToThrowError(async () => {
        return await callAsyncStubbed({ _id: testCus.userId }, 'rm.job', {
          id: Random.id(),
          reason: 'test',
        })
      })
      debug('not ADM in result  ', result)
      expect(result).to.have.property('status').which.equal('failed')
    })
    it('should work with valid job id and role', async () => {
      const testADM = await Factory.createAsync('UserADM')
      const testCusProfile = await Factory.createAsync('UserPART')
      const testCus = await Profiles.findOneAsync({ _id: testCusProfile.userId })

      // create job
      const persons = [
        {
          userId: testCusProfile.userId,
          name: testCusProfile.name,
          mobile: testCusProfile.mobile,
          email: getUserEmailAddress(testCus),
          role: 'PART',
        },
      ]
      await Factory.createAsync('vic-buy')
      const job = await Factory.createAsync('job.vic-buy')
      const result = await expectNotToThrowError(async () => {
        return await callAsyncStubbed({ _id: testADM.userId }, 'rm.job', {
          id: job._id,
          reason: 'test',
        })
      })
      debug('should work', result)
      expect(result).to.have.property('status').which.equal('success')
    })
  })
})
