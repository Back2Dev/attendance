import { Random } from 'meteor/random'
import { expect } from 'chai'
import faker from 'faker'

import Sessions from './schema'

export const goodSessions = [
  {
    memberId: Random.id(),
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
    memberId: Random.id(),
    eventId: Random.id(),
    memberName: faker.name.findName(),
    name: faker.address.cityName(),
    status: 'cancelled',
    toolName: faker.vehicle.model(),
    toolId: Random.id(),
  },
  {
    memberId: Random.id(),
    eventId: Random.id(),
    memberName: faker.name.findName(),
    name: faker.address.cityName(),
    status: 'attended',
  },
]

export const badSessions = [
  {
    // empty
  },
  {
    // memberId: Random.id(),
    eventId: Random.id(),
    memberName: faker.name.findName(),
    name: faker.address.cityName(),
    status: 'missed',
  },
]

describe('Sessions Schema', () => {
  describe('Check good sessions', () => {
    goodSessions.map((item) => {
      it(`Should success on good sessions insert ${item.title || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = Sessions.insert(item)
        }).not.to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Sessions.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad sessions', () => {
    badSessions.map((item) => {
      it(`Should fail on bad sessions insert ${item.title || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = Sessions.insert(item)
        }).to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Sessions.remove({ _id: insertedId })
        }
      })
    })
  })
})
