import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import { Factory } from '/imports/test/factories'

import Assessment, { STATUS } from '/imports/api/assessments/assessment'

// TODO: More examples of badAssessment form data structure
const badAssessment = []

badAssessment.push(Factory.build('assessment', { customerDetails: {}}))
badAssessment.push(Factory.build('assessment', { temporaryBike: 'false'}))
badAssessment.push(Factory.build('assessment', { status: 99 }))

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
        expect(() => Assessment.insert(bad)).to.throw() 
      })
    })
  })

  goodAssessment.forEach((good, i) => {
    describe(`Good assessment form (${i+1})`, () => {
      it('will save to database', () => {
        const calcTotalCost = good.services.totalServiceCost + good.parts.totalPartsCost + good.additionalFees
        const calcServiceCost = good.services.serviceItem.reduce((a, b) => {
          return (a + b['price'])
        }, 0)
        const calcPartsCost = good.parts.partsItem.reduce((a, b) => {
          return (a + b['price'])
        }, 0)

        // Passes, doesn't throw 
        expect(calcTotalCost).to.equal(good.totalCost)
        expect(calcServiceCost).to.equal(good.services.totalServiceCost)
        expect(calcPartsCost).to.equal(good.parts.totalPartsCost)
        expect(STATUS).to.include(good.status)
        expect(() => Assessment.insert(good)).to.not.throw()
      })
    })
  })
})
