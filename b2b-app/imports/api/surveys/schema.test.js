// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Surveys from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.surveys'

const badSurveys = [
  // no name
  {},
]

const goodSurveys = []

goodSurveys.push(Factory.build('surveys'))

describe('surveys', () => {
  goodSurveys.forEach((good, i) => {
    describe('query database good surveys', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Surveys.insert(good)
        const thing = Surveys.findOne(id)
        const fields = ['name', 'version', 'active'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badSurveys.forEach((bad, i) => {
    describe('SurveysSchema bad surveys', () => {
      it(`Succeeds on BAD Surveys insert ${i + 1}`, () => {
        expect(() => Surveys.insert(bad)).to.throw()
      })
    })
  })
})
