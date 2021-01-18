import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import faker from 'faker'
import Factory from '/imports/test/factories'

import Logger from '/imports/api/assessments/logger'

const badLogs = []

badLogs.push(Factory.build('logger', { aId: [] }))
badLogs.push(Factory.build('logger', { user: '' }))

const goodLogs = []

goodLogs.push(Factory.build('logger'))
goodLogs.push(Factory.build('logger'))
goodLogs.push(Factory.build('logger'))

describe('logger/schema', () => {
  beforeEach(resetDatabase)

  badLogs.forEach((bad, i) => {
    describe(`Bad logs (${i + 1})`, () => {
      it('will not save to database', () => {
        // Fail validation, throw
        expect(() => Logger.insert(bad)).to.throw()
      })
    })
  })

  goodLogs.forEach((good, i) => {
    describe(`Good logs (${i + 1})`, () => {
      it('will save to database', () => {
        // Passes, doesn't throw
        expect(() => Logger.insert(good)).to.not.throw()
      })
    })
  })
})
