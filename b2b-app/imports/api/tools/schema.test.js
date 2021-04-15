import { expect } from 'chai'
import faker from 'faker'

import Tools from './schema'

const debug = require('debug')('b2b:tools:testSchema')

export const goodTools = [
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

export const badTools = [
  {
    // empty
  },
  {
    name: faker.name.findName(),
    active: 'some string',
  },
]

describe('Tools Schema', () => {
  describe('Check good tools', () => {
    goodTools.map((item) => {
      it(`Should success on good tools insert ${item.name || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = Tools.insert(item)
        }).not.to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          // Tools.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad tools', () => {
    badTools.map((item) => {
      it(`Should fail on bad tools insert ${item.name || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = Tools.insert(item)
        }).to.throw()
        if (insertedId) {
          debug({ insertedId })
          // because of unique index, we should remove these test items
          // Tools.remove({ _id: insertedId })
        }
      })
    })
  })
})
