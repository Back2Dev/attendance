// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Triggers from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.triggers'

const badTriggers = [
  // no name
  {},
]

const goodTriggers = []

goodTriggers.push(Factory.build('triggers'))

describe('triggers', () => {
  goodTriggers.forEach((good, i) => {
    describe('query database good triggers', () => {
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Triggers.insertAsync(good)
        if (!id) throw 'Event insert failed'
        const thing = await Triggers.findOneAsync(id)
        if (!thing) throw 'Event not found after insert'
        const fields = ['name', 'slug'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badTriggers.forEach((bad, i) => {
    describe('TriggersSchema bad triggers', () => {
      it(`Succeeds on BAD Triggers insert ${i + 1}`, async () => {
        await expect(Triggers.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
