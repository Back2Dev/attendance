/**
 * schema test
 * we probably don't need to unit test all the schemas but I put this
 * suite together so i could understand how SimpleSchema.autoValue() actually
 * works and where the holes are.
 */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'

import Parts from '/imports/api/assessments/parts'

const badParts = [
  {
    name: 'Nothing',
    price: '123',
  },
  {
    name: 123,
    price: 10000
  },
  {
    name: '',
    price: '10000'
  }
]

const goodParts = [];

Factory.define('parts', Parts, {
  name: faker.commerce.productName(),
  price: Math.round(faker.commerce.price())
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
        // passes, doesn't throw
        expect(good.name).to.be.a('string')
        expect(good.price).to.be.a('number')
        expect(() => Parts.insert(good)).to.not.throw()
      })
    })
  })
})