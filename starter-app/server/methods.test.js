import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { resetDatabase } from '/imports/api/cleaner'
import { chai, expect } from 'chai'

import { callStubbed } from '/imports/test/method-stub'
import Factory from '/imports/test/factories'
import './methods.js'
import CONSTANTS from '/imports/api/constants'

if (Meteor.isServer) {
  describe('Meteor server methods', () => {
    beforeEach(function () {
      // resetDatabase()
    })
  })
}
