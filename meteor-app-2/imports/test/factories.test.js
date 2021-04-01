// factories.test.js
// eslint-disable no-unused-expressions

//
// We don't need to unit test all the factories, all that we
// need to do here is some basic testing. Module tests will
// exercise things at a higher level
//

import { expect } from 'chai'
import { resetDatabase } from '/imports/api/cleaner'

import Factory from '/imports/test/factories'

describe('Factories', () => {
  beforeEach(function () {
    // resetDatabase()
  })
})
