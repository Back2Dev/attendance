// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

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
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Cronjobs.insert(good)
        const thing = Cronjobs.findOne(id)
        const fields = ["name","frequency","type","lastRun","nextRun"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badCronjobs.forEach((bad, i) => {
    describe('CronjobsSchema bad cronjobs', () => {
      it(`Succeeds on BAD Cronjobs insert ${i + 1}`, () => {
        expect(() => Cronjobs.insert(bad)).to.throw()
      })
    })
  })
})
