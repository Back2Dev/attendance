import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'
import chaiAsPromised from 'chai-as-promised'

import './methods'
import { push } from './server/helper'

// import { notifyPayload } from './schema'
// import Profiles from '/imports/api/profiles/schema.js'
// import Factory from '/imports/test/factories'

use(assertArrays)
use(chaiAsPromised)

const debug = require('debug')('app:notifications:test')

const testUserId = Random.id()

const testData = [
  {
    userId: testUserId,
    type: 'test',
    message: `some test message ${Random.id(5)}`,
    url: '/',
  },
  {
    userId: testUserId,
    type: 'test',
    message: `some test message ${Random.id(5)}`,
    url: '/',
  },
  {
    userId: testUserId,
    type: 'test',
    message: `some test message ${Random.id(5)}`,
    url: '/',
  },
]

// Tests start here
describe('Test notifications methods', () => {
  describe('call notificationsCheck', () => {
    it('notificationsCheck should FAIL if user not logged in', async () => {
      const theMethod = Meteor.server.method_handlers['notificationsCheck']
      const thisContext = {
        userId: null,
      }
      let result
      result = await theMethod.apply(thisContext)
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
    it('notificationsCheck should work if user is logged in', async () => {
      // push some data
      await Promise.all(testData.map((data) => push(data)))
      const theMethod = Meteor.server.method_handlers['notificationsCheck']
      const thisContext = {
        userId: testUserId,
      }
      let result
      result = await theMethod.apply(thisContext)
      expect(result).to.have.property('status').which.equal('success')
    })
  })
  describe('call notificationsGetRecently', () => {
    const theMethod = Meteor.server.method_handlers['notificationsGetRecently']
    it('notificationsGetRecently should throw on bad params', async () => {
      // push some data
      await Promise.all(testData.map((data) => push(data)))
      // debug({ pushedResult })
      const badParams = [
        {
          notificationId: Random.id(),
          after: 'some string',
        },
      ]
      const thisContext = {
        userId: testUserId,
      }
      for (const item of badParams) {
        await expect(Promise.resolve().then(() => theMethod.apply(thisContext, [item]))).to.be
          .rejected
      }
    })

    it('notificationsGetRecently should return empty array without login user', async () => {
      // push some data
      const pushedResult = await Promise.all(testData.map((data) => push(data)))
      // debug({ pushedResult })
      const { notificationId } = pushedResult[0]
      expect(notificationId).to.be.a('string')

      const thisContext = {
        // userId: testUserId,
      }
      let result
      result = await theMethod.apply(thisContext, [
        {
          notificationId,
        },
      ])
      expect(result).to.be.array()
      expect(result.length).equal(0)
    })

    it('notificationsGetRecently should return an array with logged in user', async () => {
      // push some data
      const pushedResult = await Promise.all(testData.map((data) => push(data)))
      // debug({ pushedResult })
      const { notificationId } = pushedResult[0]
      expect(notificationId).to.be.a('string')

      const thisContext = {
        userId: testUserId,
      }
      let result
      result = await theMethod.apply(thisContext, [
        {
          notificationId,
        },
      ])
      expect(result).to.be.array()
      expect(result.length).greaterThan(0)
    })
  })
  describe('call notificationsGetMore', () => {
    const theMethod = Meteor.server.method_handlers['notificationsGetMore']
    it('notificationsGetMore should throw on bad params', async () => {
      const badParams = [
        {
          notificationId: Random.id(),
          before: 'some string',
        },
      ]
      const thisContext = {
        userId: testUserId,
      }
      for (const item of badParams) {
        await expect(Promise.resolve().then(() => theMethod.apply(thisContext, [item]))).to.be
          .rejected
      }
    })

    it('notificationsGetMore should return empty array without login user', async () => {
      // push some data
      const pushedResult = await Promise.all(testData.map((data) => push(data)))
      // debug({ pushedResult })
      const { notificationId } = pushedResult[0]
      expect(notificationId).to.be.a('string')

      const thisContext = {
        // userId: testUserId,
      }
      let result
      result = await theMethod.apply(thisContext, [
        {
          notificationId,
          before: moment().add(1, 'minutes').toDate(),
        },
      ])
      expect(result).to.be.array()
      expect(result.length).equal(0)
    })

    it('notificationsGetMore should return an array with logged in user', async () => {
      // push some data
      const pushedResult = await Promise.all(testData.map((data) => push(data)))
      // debug({ pushedResult })
      const { notificationId } = pushedResult[0]
      expect(notificationId).to.be.a('string')

      const thisContext = {
        userId: testUserId,
      }
      let result
      result = await theMethod.apply(thisContext, [
        {
          notificationId,
          before: moment().add(1, 'minutes').toDate(),
        },
      ])
      expect(result).to.be.array()
      expect(result.length).greaterThan(0)
    })
  })
})
