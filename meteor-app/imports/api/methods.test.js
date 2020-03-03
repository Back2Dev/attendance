// methods-test.js
import { expect } from 'chai'

import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'
import Sessions from '/imports/api/sessions/schema'
import Purchases from '/imports/api/purchases/schema'
import { Carts } from '/imports/api/products/schema'

const debug = require('debug')('b2b:methods-test')

describe('Meteor methods /imports/api/methods-test', () => {
  describe('member/session', () => {
    beforeEach(resetDatabase)

    it('creates a member', () => {
      const member = Factory.create('member')
      expect(member).to.be.ok
    })

    it('creates a session', () => {
      const session = Factory.create('session')
      expect(session).to.be.ok
      expect(session.duration).to.be.a('number')
    })

    it('creates a workout session', () => {
      const event = Factory.create('test-event')
      const product = Factory.create('product', { code: 'PA-PASS-MULTI-10', type: 'pass' })
      const member = Factory.create('member')
      expect(() => Meteor.call('arrive', member._id, event)).to.not.throw()
      const sessions = Sessions.find({ memberId: member._id }).fetch()
      expect(sessions.length).to.be.equal(1)
      const purchases = Purchases.find({ memberId: member._id }).fetch()
      expect(purchases.length).to.be.equal(1)
      const carts = Carts.find({ memberId: member._id }).fetch()
      expect(carts.length).to.be.equal(1)
    })

    it('creates 10 workout sessions', () => {
      const event = Factory.create('test-event')
      const product = Factory.create('product', { code: 'PA-PASS-MULTI-10', type: 'pass', qty: 10 })
      const member = Factory.create('member', { subsType: 'pass' })

      for (let i = 0; i < 10; i++) {
        expect(() => Meteor.call('arrive', member._id, event)).to.not.throw()
        expect(() => Meteor.call('depart', member._id, event)).to.not.throw()
      }

      const sessions = Sessions.find({ memberId: member._id }).fetch()
      expect(sessions.length).to.be.equal(10)
      const purchases = Purchases.find({ memberId: member._id }).fetch()
      debug('purchases', purchases)
      expect(purchases.length).to.be.equal(2)
      const carts = Carts.find({ memberId: member._id }).fetch()
      expect(carts.length).to.be.equal(1)
      expect(carts[0].totalqty).to.be.equal(2)
    })
  })
})
