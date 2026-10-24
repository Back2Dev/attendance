import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
import Factory from '/imports/test/factories'

import Assessments, { STATUS } from '/imports/api/assessments/schema'

const badAssessment = []

badAssessment.push(
  Factory.build('assessment', { customerDetails: {} })
)
badAssessment.push(
  Factory.build('assessment', { temporaryBike: 'falsee' })
)
badAssessment.push(Factory.build('assessment', { status: 99 }))
badAssessment.push(
  Factory.build('assessment', {
    services: { totalServiceCost: 4000 },
  })
)
badAssessment.push(
  Factory.build('assessment', { parts: { totalPartsCost: 4000 } })
)
badAssessment.push(Factory.build('assessment', { totalCost: 10000 }))

const goodAssessment = []

goodAssessment.push(Factory.build('assessment'))
goodAssessment.push(Factory.build('assessment'))
goodAssessment.push(Factory.build('assessment'))

describe('assessment/schema', () => {
  beforeEach(() => resetDatabase())

  badAssessment.forEach((bad, i) => {
    describe(`Bad assessment form (${i + 1})`, () => {
      it('will not save to database', async () => {
        // Fail validation, throw
        await expect(Assessments.insertAsync(bad)).to.be.rejected
      })
    })
  })

  goodAssessment.forEach((good, i) => {
    describe(`Good assessment form (${i + 1})`, () => {
      it('will save to database', async () => {
        // Passes, doesn't throw
        await expect(Assessments.insertAsync(good)).to.be.fulfilled
      })
    })
  })
})
