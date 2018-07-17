import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'

import Assessment, { STATUS } from '/imports/api/assessments/assessment'

// TODO: More examples of badAssessment form data structure
const badAssessment = [{
  customerDetails: {
    name: 'test',
    phone: 'test',
    refurbishment: false,
  },
  bikeDetails: {
    make: 'Dahon',
    color: 'Red',
    bikeValue: 'Five',
  },
  services: {
    serviceItem: [
      {},
      {
        name: 'Fix tyre',
        price: '500',
      }
    ],
    totalServiceCost: '2000',
  },
  parts: {
    partsItem: [
      {},
      {
        name: 'Handle Bar',
        price: '2000',
      },
    ],
    totalPartsCost: '2000',
  },
  additionalFees: '2000',
  totalCost: '2000',
  dropoffDate: new Date(),
  pickupDate: new Date(),
  urgent: 'true',
  assessor: 'James',
  mechanic: 'Mike',
  comment: '',
  temporaryBike: 'false',
  status: 'Completed',
  search: 'abc'
}]

const goodAssessment = []

Factory.define('assessment', Assessment, {
  customerDetails: {
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    refurbishment: faker.random.boolean(),
  },
  bikeDetails: {
    make: faker.commerce.productName(),
    model: 'TX-1234',
    color: faker.commerce.color(),
    bikeValue: Math.round(faker.finance.amount()),
    sentimentValue: faker.random.boolean(),
  },
  services: {
    serviceItem: [
      {
        name: 'Fix tyre',
        price: 5000,
      }
    ],
    totalServiceCost: 5000,
  },
  parts: {
    partsItem: [
      {
        name: 'Handle Bar',
        price: 2000,
      }
    ],
    totalPartsCost: 2000,
  },
  additionalFees: 1500,
  totalCost: 8500,
  dropoffDate: faker.date.future(),
  pickupDate: faker.date.future(),
  urgent: faker.random.boolean(),
  assessor: faker.name.findName(),
  mechanic: faker.name.findName(),
  comment: 'Thorough cleaning of the bike is required',
  temporaryBike: faker.random.boolean(),
  status: 'New Job',
  search: faker.name.findName(),
})

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
