// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Logs from './schema'
import Factory from '/imports/test/factories'
// import '/imports/test/factory.logs'

const badLogs = [
  // no name
  {},
  {
    message: 'Something will not work',
  },
]

const goodLogs = [
  {
    level: 'info',
    message: 'Something happened',
    user: 'Random user id',
  },
  {
    level: 'warn',
    message: 'Something else happened',
    user: 'Random user id',
    data: { names: ['Hello', 'again'] },
  },
  {
    level: 'error',
    message: 'Something else happened',
    user: 'Random user id',
    data: 'Hello mr postman',
  },
  {
    level: 'debug',
    message: 'Something else happened',
    user: 'Random user id',
    data: true,
  },
  {
    level: 'info',
    message: 'Something else happened',
    user: 'Random user id',
    data: 999,
  },
  {
    level: 'info',
    message: 'Something else happened',
    user: 'Random user id',
    data: { description: 'Hello' },
  },
]

// goodLogs.push(Factory.build('logs'))

describe('logs', () => {
  goodLogs.forEach((good, i) => {
    describe('query database good logs', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Logs.insert(good)
        const thing = Logs.findOne(id)
        const fields = ['message', 'level', 'user'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badLogs.forEach((bad, i) => {
    describe('LogsSchema bad logs', () => {
      it(`Succeeds on BAD Logs insert ${i + 1}`, () => {
        expect(() => Logs.insert(bad)).to.throw()
      })
    })
  })
})
