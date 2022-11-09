// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Schemas from './schema'
import Factory from '/imports/test/factories'
import { assetSchemas } from '/imports/test/schemas.factory'

const debug = require('debug')('app:schemas-test')

const badSchemas = [
  // no name
  {},
]

const goodSchemas = []

goodSchemas.push(Factory.build('schemas'))

describe('schemas', () => {
  // beforeEach(resetDatabase)
  it('create asset schemas', () => {
    // This will insert the asset sub-schemas into the database
    const schemas = assetSchemas()
    debug({ schemas })
    expect(schemas.length).to.equal(6) // There are 6 sub-schemas in the asset list, including intermediate sub-schemas

    // Now Iterate through the sub-schemas
    const allSchemas = Schemas.find({}).fetch()
    // ...

    /* Now iterate through them and build complete schema objects, 
    one for each "end" schema, ie Car, Bus Tool
    */
    // ...

    /**
     * And finally, validate some test objects against the various schemas
     * - we need to test both success and failure scenarios
     */
    // ...
  })
})
