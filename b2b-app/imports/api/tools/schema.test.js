import { expect } from 'chai'

import Tools from './schema'

export const goodTools = [
  {
    name: 'string',
    status: 1,
  },
  {
    name: 'some string',
    status: 0,
  },
  {
    name: 'another string',
  },
  {
    name: 'date',
    status: -1,
  },
]

export const badTools = [
  {
    // empty
  },
  {
    name: 'some string',
    status: 0.5,
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
          Tools.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad tools', () => {
    badTools.map((item) => {
      it(`Should fail on bad tools insert ${item.name || ''}`, () => {
        let insertedId
        expect(() => {
          insertedId = insertedId = Tools.insert(item)
        }).to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          Tools.remove({ _id: insertedId })
        }
      })
    })
  })
})
