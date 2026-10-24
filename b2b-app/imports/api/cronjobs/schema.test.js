// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Cronjobs from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.cronjobs'

const badCronjobs = [
  // no name
  {},
]

const goodCronjobs = []

goodCronjobs.push(Factory.build('cronjobs'))

describe('cronjobs', () => {
  goodCronjobs.forEach((good, i) => {
    describe('query database good cronjobs', () => {
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Cronjobs.insertAsync(good)
        const thing = await Cronjobs.findOneAsync(id)
        const fields = ["name","frequency","type","lastRun","nextRun"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badCronjobs.forEach((bad, i) => {
    describe('CronjobsSchema bad cronjobs', () => {
      it(`Succeeds on BAD Cronjobs insert ${i + 1}`, async () => {
        await expect(Cronjobs.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
