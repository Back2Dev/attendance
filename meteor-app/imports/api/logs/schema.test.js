// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Logs from './schema'
import Factory from '/imports/test/factories'

const badLogs = [
  //  no name
  {},
]

const goodLogs = []

goodLogs.push(Factory.build('logs'))

describe('logs', () => {
  beforeEach(resetDatabase)

  goodLogs.forEach((good, i) => {
    describe('LogsSchema good docs', () => {
      it(`Succeeds on GOOD Logs insert ${i + 1}`, () => {
        expect(() => Logs.insert(good)).not.to.throw()
      })
    })

    describe('query database good event', () => {
      it('success if database query matches', () => {
        const id = Logs.insert(good)
        const thing = Logs.findOne(id)
        expect(thing._id).to.equal(good._id)
        // Templated replacement...
        const fields =
          [
            'userId',
            'memberId',
            'oId',
            'status',
            'type',
            'description',
          ] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })

    badLogs.forEach((bad, i) => {
      describe('LogsSchema bad parts', () => {
        it(`Succeeds on BAD Logs insert ${i + 1}`, () => {
          expect(() => Logs.insert(bad)).to.throw()
        })
      })
    })
  })
})
