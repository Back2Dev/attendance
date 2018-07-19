import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import Factory from '/imports/test/factories'

import ServiceItems from '/imports/api/assessments/serviceItems'

const badParts = []

badParts.push(Factory.build('parts', { price: 'abc' }))
badParts.push(Factory.build('parts', { price: '' }))
badParts.push(Factory.build('parts', { name: '' }))

const goodParts = []

goodParts.push(Factory.build('parts'))
goodParts.push(Factory.build('parts'))
goodParts.push(Factory.build('parts'))

describe('parts/schema', () => {

  beforeEach(resetDatabase)

  badParts.forEach((bad, i) => {
    describe(`Bad parts (${i+1})`, () => {
      it('will not save to database', () => {
        // Fail validation, throw
        expect(() => ServiceItems.insert(bad)).to.throw()
      })
    })
  })

  goodParts.forEach((good, i) => {
    describe(`Good parts (${i+1})`, () => {
      it('will save to database', () => {
        // Passes, doesn't throw
        expect(() => ServiceItems.insert(good)).to.not.throw()
      })
    })
  })
})