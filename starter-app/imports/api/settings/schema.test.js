import { Random } from 'meteor/random'
import { expect } from 'chai'

import Settings from './schema'

export const goodSettings = [
  {
    name: 'string',
    key: Random.id(),
    value: 'string value',
  },
  {
    name: 'number',
    key: Random.id(),
    value: 1234, // will be converted to string: '1234'
  },
  {
    name: 'anotherNumber',
    key: Random.id(),
    value: 12.5, // will be converted to string: '12.5'
  },
  {
    name: 'date',
    key: Random.id(),
    value: new Date(), // will be converted to string like: Tue Nov 24 2020 10:20:08 GMT+0700 (Indochina Time)
  },
  {
    name: 'readonly enabled',
    key: Random.id(),
    value: 'string value',
    readonly: true,
  },
]

export const badSettings = [
  {
    name: 'some name',
    key: 'no value',
  },
  {
    name: 'no key',
    value: 'some value',
  },
  {
    value: 'no name',
  },
  {
    name: 'object value',
    key: 'object',
    value: {
      otherKey: 'value',
    },
  },
  {
    name: 'array value',
    key: 'array',
    value: ['some', 'value'],
  },
  {
    name: 'invalid public value',
    key: 'test public value',
    value: 'some value',
    public: 'some string',
  },
  {
    name: 'invalid readonly value',
    key: 'test readonly value',
    value: 'some value',
    readonly: 'some string',
  },
  {
    // empty
  },
]

describe('Settings Schema', () => {
  describe('Check good settings', () => {
    goodSettings.map((setting) => {
      it(`Should success on good Settings insert ${
        setting.name || setting.key || ''
      }`, () => {
        let insertedId
        expect(() => {
          insertedId = Settings.insert(setting)
        }).not.to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          Settings.remove({ _id: insertedId })
        }
      })
    })
  })
  describe('Check bad settings', () => {
    badSettings.map((setting) => {
      it(`Should success on bad Settings insert ${
        setting.name || setting.key || ''
      }`, () => {
        let insertedId
        expect(() => {
          insertedId = Settings.insert(setting)
        }).to.throw()
        if (insertedId) {
          // because of unique index, we should remove these test items
          Settings.remove({ _id: insertedId })
        }
      })
    })
  })
})
