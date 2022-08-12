// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Schemas from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.schemas'

const badSchemas = [
  // no name
  {},
]

const goodSchemas = []

goodSchemas.push(Factory.build('schemas'))

describe('schemas', () => {
  goodSchemas.forEach((good, i) => {
    describe('query database good schemas', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Schemas.insert(good)
        const thing = Schemas.findOne(id)
        const fields = ["name","fields","fields.$","active"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badSchemas.forEach((bad, i) => {
    describe('SchemasSchema bad schemas', () => {
      it(`Succeeds on BAD Schemas insert ${i + 1}`, () => {
        expect(() => Schemas.insert(bad)).to.throw()
      })
    })
  })
})
