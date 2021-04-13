import { expect } from 'chai'

import Sessions from './schema'

export const goodSessions = [
  {
    title: 'string',
    map: 'string',
    description: 'string',
    difficulty: 'string',
    status: 1,
  },
  {
    title: 'string',
    description: 'string',
    difficulty: 'string',
    status: 0,
  },
  {
    title: 'string',
    description: 'string',
  },
  {
    title: 'string',
  },
]

export const badSessions = [
  {
    // empty
  },
  {
    map: 'string',
    status: 0.5,
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
          Sessions.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad sessions', () => {
    badSessions.map((item) => {
      it(`Should fail on bad sessions insert ${item.title || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = insertedId = Sessions.insert(item)
        }).to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          Sessions.remove({ _id: insertedId })
        }
      })
    })
  })
})
