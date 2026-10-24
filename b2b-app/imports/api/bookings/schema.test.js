import { Random } from 'meteor/random'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
import faker from 'faker'

import Bookings from './schema'

export const goodBookings = [
  {
    profileId: Random.id(),
    eventId: Random.id(),
    memberName: faker.name.findName(),
    name: faker.address.cityName(),
    status: 'booked',
    toolName: faker.vehicle.model(),
    toolId: Random.id(),
    bookedDate: faker.date.future(),
    bookedAt: new Date(),
  },
  {
    profileId: Random.id(),
    eventId: Random.id(),
    memberName: faker.name.findName(),
    name: faker.address.cityName(),
    status: 'cancelled',
    toolName: faker.vehicle.model(),
    toolId: Random.id(),
  },
  {
    profileId: Random.id(),
    eventId: Random.id(),
    memberName: faker.name.findName(),
    name: faker.address.cityName(),
    status: 'attended',
  },
]

export const badBookings = [
  {
    // empty
  },
  {
    // profileId: Random.id(),
    eventId: Random.id(),
    memberName: faker.name.findName(),
    name: faker.address.cityName(),
    status: 'missed',
  },
]

describe('Bookings Schema', () => {
  describe('Check good bookings', () => {
    goodBookings.map((item) => {
      it(`Should success on good bookings insert ${item.title || ''}`, async () => {
        let insertedId
        insertedId = await Bookings.insertAsync(item)
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Bookings.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad bookings', () => {
    badBookings.map((item) => {
      it(`Should fail on bad bookings insert ${item.title || ''}`, async () => {
        let insertedId
        await expect(Bookings.insertAsync(item)).to.be.rejected
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Bookings.remove({ _id: insertedId })
        }
      })
    })
  })
})
