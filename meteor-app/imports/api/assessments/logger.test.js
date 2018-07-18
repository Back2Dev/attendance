import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'

import Logger from '/imports/api/assessments/logger'

const badLogs = [
  {
    user: '1234',
    requestType: [],
    requestBody: ''
  },
  {
    user: '',
    requestType: 'Submit form',
    requestBody: 12345678
  },
]

const goodLogs = []

Factory.define('logs', Logger, {
  user: faker.name.findName(),
  requestType: 'Update form',
  requestBody: faker.random.words()
})

goodLogs.push(Factory.build('logs'))
goodLogs.push(Factory.build('logs'))
goodLogs.push(Factory.build('logs'))

describe('logger/schema', () => {

  beforeEach(resetDatabase)

  badLogs.forEach((bad, i) => {
    describe(`Bad logs (${i+1})`, () => {
      it('will not save to database', () => {
        // Fail validation, throw
        expect(() => Logger.insert(bad)).to.throw() 
      })
    })
  })

  goodLogs.forEach((good, i) => {
    describe(`Good logs (${i+1})`, () => {
      it('will save to database', () => {
        // Passes, doesn't throw
        expect(() => Logger.insert(good)).to.not.throw()
      })
    })
  })
})