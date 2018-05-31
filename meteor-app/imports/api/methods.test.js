// methods-test.js
import { expect } from 'chai';

import { resetDatabase } from '/imports/test/util-test'
import Factory, {  } from '/imports/test/factories';

describe('Meteor methods /imports/api/methods-test', () => {
  describe('member', () => {
		beforeEach(resetDatabase)
    it('creates a member', () => {
      const member = Factory.create('member');
      expect(member).to.be.ok
    })
  })
})
