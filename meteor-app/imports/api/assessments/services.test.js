import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import Factory from '/imports/test/factories'

import Services from '/imports/api/assessments/services'

const badServices = []

badServices.push(Factory.build('services', { name: '' }))
badServices.push(Factory.build('services', { price: '' }))
badServices.push(Factory.build('services', { price: 'abc' }))

const goodServices = []

goodServices.push(Factory.build('services'))
goodServices.push(Factory.build('services'))
goodServices.push(Factory.build('services'))

describe('services/schema', () => {

  beforeEach(resetDatabase)

  badServices.forEach((bad, i) => {
    describe(`Bad services (${i+1})`, () => {
      it('will not save to database', () => {
        // Fail validation, throw
        expect(() => Services.insert(bad)).to.throw() 
      })
    })
  })

  goodServices.forEach((good, i) => {
    describe(`Good services (${i+1})`, () => {
      it('will save to database', () => {
        // passes, doesn't throw
        expect(() => Services.insert(good)).to.not.throw() 
      })
    })
  })
})