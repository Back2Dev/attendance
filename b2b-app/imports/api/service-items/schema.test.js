// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import ServiceItems from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.service-items'

const badServiceItems = [
  // no name
  {},
]

const goodServiceItems = []

goodServiceItems.push(Factory.build('serviceItems'))

describe('serviceItems', () => {
  goodServiceItems.forEach((good, i) => {
    describe('query database good serviceItems', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = ServiceItems.insert(good)
        const thing = ServiceItems.findOne(id)
        const fields =
          [
            '_id',
            'name',
            'price',
            'code',
            'category',
            'used',
            'createdAt',
            'updatedAt',
          ] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badServiceItems.forEach((bad, i) => {
    describe('ServiceItemsSchema bad serviceItems', () => {
      it(`Succeeds on BAD ServiceItems insert ${i + 1}`, () => {
        expect(() => ServiceItems.insert(bad)).to.throw()
      })
    })
  })
})
