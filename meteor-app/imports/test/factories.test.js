/* eslint-disable no-unused-expressions */

/**
 * We don't need to unit test all the factories, it's safe
 * enough to assume that the Factory module does its job.
 * I just needed to test a couple of assumptions about how the
 * nested dependency stuff would work.
 */

import { expect } from 'chai';

import Factory, {  } from '/imports/test/factories';

describe('Factories', () => {
  describe('member', () => {
    it('creates objects', () => {
      const member = Factory.create('member');
      expect(member).to.be.ok;
      expect(member.name).to.be.a('string');
      // expect(member.createdAt).to.be.a('date');
      expect(member.updatedAt).not.to.be.ok;
    });
  });

});
