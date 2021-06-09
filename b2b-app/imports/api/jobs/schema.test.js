// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Jobs from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.jobs'

const badJobs = [
  // no name
  {},
]

const goodJobs = []

goodJobs.push(Factory.build('jobs'))

describe('jobs', () => {
  goodJobs.forEach((good, i) => {
    describe('query database good jobs', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Jobs.insert(good)
        const thing = Jobs.findOne(id)
        const fields = ["_id","name","phone","email","isRefurbish","make","model","color","bikeValue"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badJobs.forEach((bad, i) => {
    describe('JobsSchema bad jobs', () => {
      it(`Succeeds on BAD Jobs insert ${i + 1}`, () => {
        expect(() => Jobs.insert(bad)).to.throw()
      })
    })
  })
})
