// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import MyCollection from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.my-collection'

const badMyCollection = [
  // no name
  {},
]

const goodMyCollection = []

goodMyCollection.push(Factory.build('myCollection'))

describe('myCollection', () => {
  goodMyCollection.forEach((good, i) => {
    describe('query database good myCollection', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = MyCollection.insert(good)
        const thing = MyCollection.findOne(id)
        const fields = TEMPLATED_FIELD_LIST || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badMyCollection.forEach((bad, i) => {
    describe('MyCollectionSchema bad myCollection', () => {
      it(`Succeeds on BAD MyCollection insert ${i + 1}`, () => {
        expect(() => MyCollection.insert(bad)).to.throw()
      })
    })
  })
})
