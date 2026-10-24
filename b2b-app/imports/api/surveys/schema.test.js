// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Surveys.insertAsync(good)
        const thing = await Surveys.findOneAsync(id)
        const fields = ['name', 'version', 'active'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badSurveys.forEach((bad, i) => {
    describe('SurveysSchema bad surveys', () => {
      it(`Succeeds on BAD Surveys insert ${i + 1}`, async () => {
        await expect(Surveys.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
