// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Collections from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.collections'

const badCollections = [
  // no name
  {},
]

const goodCollections = []

goodCollections.push(Factory.build('collections'))

describe('collections', () => {
  goodCollections.forEach((good, i) => {
    describe('query database good collections', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Collections.insert(good)
        const thing = Collections.findOne(id)
        const fields = ["name","active"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badCollections.forEach((bad, i) => {
    describe('CollectionsSchema bad collections', () => {
      it(`Succeeds on BAD Collections insert ${i + 1}`, () => {
        expect(() => Collections.insert(bad)).to.throw()
      })
    })
  })
})
