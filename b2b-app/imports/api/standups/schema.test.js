// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Standups from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.standups'

const badStandups = [
  // no name
  {},
]

const goodStandups = []

goodStandups.push(Factory.build('standups'))

describe('standups', () => {
  goodStandups.forEach((good, i) => {
    describe('query database good standups', () => {
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Standups.insertAsync(good)
        const thing = await Standups.findOneAsync(id)
        const fields = ["teamId","when","notes"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badStandups.forEach((bad, i) => {
    describe('StandupsSchema bad standups', () => {
      it(`Succeeds on BAD Standups insert ${i + 1}`, async () => {
        await expect(Standups.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
