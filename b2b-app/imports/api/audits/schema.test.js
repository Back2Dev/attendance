// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Audits from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.audits'

const badAudits = [
  // no name
  {},
  {
    name: 'Something will not work',
  },
]

const goodAudits = [
  {
    event: 'Something happened',
    user: 'Random user id',
  },
  {
    event: 'Something else happened',
    user: 'Random user id',
    data: ['Hello', 'Goodbye'],
  },
  {
    event: 'Something else happened',
    user: 'Random user id',
    data: 'Hello',
  },
  {
    event: 'Something else happened',
    user: 'Random user id',
    data: { message: 'Hello' },
  },
]

goodAudits.push(Factory.build('audits'))

describe('audits', () => {
  goodAudits.forEach((good, i) => {
    describe('query database good audits', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Audits.insert(good)
        const thing = Audits.findOne(id)
        const fields = ['event', 'user'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badAudits.forEach((bad, i) => {
    describe('AuditsSchema bad audits', () => {
      it(`Throws on BAD Audits insert ${i + 1}`, () => {
        expect(() => Audits.insert(bad)).to.throw()
      })
    })
  })
})
