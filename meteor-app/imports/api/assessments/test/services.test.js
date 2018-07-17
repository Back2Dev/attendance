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

import Services from '/imports/api/assessments/services'

const badServices = [
  {
    name: 'Nothing',
    price: '123',
  },
  {
    name: 123,
    price: 10000
  },
  {
    name: ' ',
    price: '10000'
  }
]

const goodServices = []

Factory.define('services', Services, {
  name: faker.commerce.productName(),
  price: Math.round(faker.commerce.price())
})

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