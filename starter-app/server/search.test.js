import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/api/cleaner'
import { expect } from 'chai'
import { callStubbed } from '/imports/test/method-stub'
import Factory from '/imports/test/factories'
import { search } from '/server/search'
import './methods.js'
import CONSTANTS from '/imports/api/constants'

if (Meteor.isServer) {
  describe('Search method', function () {
    beforeEach(function () {
      // resetDatabase() // not working currently
    })
    // it('should not throw error', () => {
    //   expect(() => callStubbed({}, 'search', 'matt'))
    //       .not.to.throw()
    // })
  })
}
