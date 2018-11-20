import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import Factory from '/imports/test/factories'

import Assessments, { STATUS } from '/imports/api/assessments/assessments'

const badAssessment = []

badAssessment.push(Factory.build('assessment', { customerDetails: {}}))
badAssessment.push(Factory.build('assessment', { temporaryBike: 'falsee'}))
badAssessment.push(Factory.build('assessment', { status: 99 }))
badAssessment.push(Factory.build('assessment', { services: { totalServiceCost: 4000 } }))
badAssessment.push(Factory.build('assessment', { parts: { totalPartsCost: 4000 } }))
badAssessment.push(Factory.build('assessment', { totalCost: 10000 }))

const goodAssessment = []

goodAssessment.push(Factory.build('assessment'))
goodAssessment.push(Factory.build('assessment'))
goodAssessment.push(Factory.build('assessment'))

describe('assessment/schema', () => {

  beforeEach(resetDatabase)

  badAssessment.forEach((bad, i) => {
    describe(`Bad assessment form (${i+1})`, () => {
      it('will not save to database', () => {
        // Fail validation, throw
        expect(() => Assessments.insert(bad)).to.throw() 
      })
    })
  })

  goodAssessment.forEach((good, i) => {
    describe(`Good assessment form (${i+1})`, () => {
      it('will save to database', () => {

        // Passes, doesn't throw 
        expect(() => Assessments.insert(good)).to.not.throw()
      })
    })
  })
})
