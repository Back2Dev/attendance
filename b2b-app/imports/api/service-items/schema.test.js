// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await ServiceItems.insertAsync(good)
        const thing = await ServiceItems.findOneAsync(id)
        const fields = ['_id', 'name', 'price', 'code', 'category', 'used'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badServiceItems.forEach((bad, i) => {
    describe('ServiceItemsSchema bad serviceItems', () => {
      it(`Succeeds on BAD ServiceItems insert ${i + 1}`, async () => {
        await expect(ServiceItems.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
