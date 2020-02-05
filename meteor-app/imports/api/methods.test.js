// methods-test.js
import { expect } from 'chai'

import { resetDatabase } from '/imports/test/util-test'
import Factory from '/imports/test/factories'

describe('Meteor methods /imports/api/methods-test', () => {
  describe.only('member/session', () => {
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
      const member = Factory.create('member')
      expect(() => Meteor.call('arrive', member._id, event)).to.not.throw()
    })
  })
})
