// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Logs.insertAsync(good)
        const thing = await Logs.findOneAsync(id)
        const fields = ['message', 'level', 'user'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badLogs.forEach((bad, i) => {
    describe('LogsSchema bad logs', () => {
      it(`Succeeds on BAD Logs insert ${i + 1}`, async () => {
        await expect(Logs.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
