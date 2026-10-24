// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Collections.insertAsync(good)
        const thing = await Collections.findOneAsync(id)
        const fields = ["name","active"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badCollections.forEach((bad, i) => {
    describe('CollectionsSchema bad collections', () => {
      it(`Succeeds on BAD Collections insert ${i + 1}`, async () => {
        await expect(Collections.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
