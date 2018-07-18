import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'

import Parts from '/imports/api/assessments/parts'

const badParts = [
  {
    name: 'Nothing',
    price: 'abc',
  },
  {
    name: '123',
    price: 'abc'
  },
  {
    name: '',
    price: '10000'
  }
]

const goodParts = []

Factory.define('parts', Parts, {
  name: faker.commerce.productName(),
  price: Math.round(faker.commerce.price()*100) 
})

goodParts.push(Factory.build('parts'))
goodParts.push(Factory.build('parts'))
goodParts.push(Factory.build('parts'))

describe('parts/schema', () => {

  beforeEach(resetDatabase)

  badParts.forEach((bad, i) => {
    describe(`Bad parts (${i+1})`, () => {
      it('will not save to database', () => {
        // Fail validation, throw
        expect(() => Parts.insert(bad)).to.throw()
      })
    })
  })

  goodParts.forEach((good, i) => {
    describe(`Good parts (${i+1})`, () => {
      it('will save to database', () => {
        // Passes, doesn't throw
        expect(() => Parts.insert(good)).to.not.throw()
      })
    })
  })
})