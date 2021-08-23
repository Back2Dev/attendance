// schema.test.js

/* eslint-disable no-unused-expressions */

import { Random } from 'meteor/random'
// import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import { push } from './helper'
// import Factory from '/imports/test/factories'
// import '/imports/test/factory.messages'

const debug = require('debug')('app:notifications:helper:test')

const goodPushData = [
  {
    userId: Random.id(),
    type: 'test',
    message: 'some test message',
    url: '/',
    data: {
      itIs: 'beautiful',
    },
  },
]

const badPushData = [
  {
    // userId: Random.id(),
    type: 'test',
    message: 'some test message',
    url: '/',
    data: {
      itIs: 'beautiful',
    },
  },
]

describe('Notifications Helper', () => {
  // beforeEach(resetDatabase)
  goodPushData.map((item) => {
    it('push notification should work', () => {
      let result
      expect(() => {
        result = push(item)
      }).not.to.throw()
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
      expect(result.itemId).to.be.a('string')
      expect(result.notificationId).to.be.a('string')
    })
  })
  badPushData.map((item) => {
    it('push notification should NOT work', () => {
      let result
      expect(() => {
        result = push(item)
      }).not.to.throw()
      expect(result).to.be.a('object')
      expect(result.status).equal('failed')
      expect(result.message).to.be.a('string')
    })
  })
})
