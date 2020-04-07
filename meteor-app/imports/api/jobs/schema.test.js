import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import Factory from '/imports/test/factories'

import Jobs, { STATUS } from '/imports/api/jobs/schema'

const badJob = []

badJob.push(Factory.build('job', {}))
badJob.push(Factory.build('job', { temporaryBike: 'falsee' }))
badJob.push(Factory.build('job', { status: 99 }))
badJob.push(Factory.build('job', { services: { totalServiceCost: 4000 } }))
badJob.push(Factory.build('job', { parts: { totalPartsCost: 4000 } }))
badJob.push(Factory.build('job', { totalCost: 10000 }))

const goodJob = []

goodJob.push(Factory.build('job'))
goodJob.push(Factory.build('job'))
goodJob.push(Factory.build('job'))

describe('job/schema', () => {
  beforeEach(resetDatabase)

  badJob.forEach((bad, i) => {
    describe(`Bad job form (${i + 1})`, () => {
      it('will not save to database', () => {
        // Fail validation, throw
        expect(() => Jobs.insert(bad)).to.throw()
      })
    })
  })

  goodJob.forEach((good, i) => {
    describe(`Good job form (${i + 1})`, () => {
      it('will save to database', () => {
        // Passes, doesn't throw
        expect(() => Jobs.insert(good)).to.not.throw()
      })
    })
  })
})
