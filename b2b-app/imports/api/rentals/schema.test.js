import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
import faker from 'faker'

import Rentals from './schema'

const debug = require('debug')('app:rentals:testSchema')

export const goodRentals = [
  {
    name: faker.name.findName(),
    location: faker.address.city(),
    description: faker.lorem.sentence(),
    active: true,
  },
  {
    name: faker.name.findName(),
    location: faker.address.city(),
    description: faker.lorem.sentence(),
  },
  {
    name: faker.name.findName(),
    location: faker.address.city(),
  },
  {
    name: faker.name.findName(),
    status: 0.6, // all number will be converted to true.
  },
  {
    name: faker.name.findName(),
  },
]

export const badRentals = [
  {
    // empty
  },
  {
    name: faker.name.findName(),
    active: 'some string',
  },
]

describe('Rentals Schema', () => {
  describe('Check good rentals', () => {
    goodRentals.map((item) => {
      it(`Should success on good rentals insert ${item.name || ''}`, async () => {
        let insertedId
        insertedId = await Rentals.insertAsync(item)
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Rentals.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad rentals', () => {
    badRentals.map((item) => {
      it(`Should fail on bad rentals insert ${item.name || ''}`, async () => {
        let insertedId
        await expect(Rentals.insertAsync(item)).to.be.rejected
        if (insertedId) {
          debug({ insertedId })
          // because of unique index, we should remove these test items
          // Rentals.remove({ _id: insertedId })
        }
      })
    })
  })
})
