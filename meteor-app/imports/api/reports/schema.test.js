// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import Reports from './schema'
import Factory from '/imports/test/factories'

const okReport = {
  code: 'RANDOM',
  description: 'A random report',
  admin: false,
  discount: 20,
  start: new Date()
}

let badReports = []
const omit = 'code description admin discount start'
badReports = omit.split(/\s+/).map(element => {
  delete cloneDeep(okReport)[element]
})

const goodReports = [okReport]

goodReports.push(Factory.build('report'))

describe('reports', () => {
  beforeEach(resetDatabase)

  goodReports.forEach((good, i) => {
    describe('ReportsSchema good reports', () => {
      it(`Succeeds on GOOD Reports insert ${i + 1}`, () => {
        expect(() => Reports.insert(good)).not.to.throw()
      })
    })

    describe('query database good report', () => {
      it('success if database query matches', () => {
        const reportId = Reports.insert(good)
        const report = Reports.findOne(reportId)

        expect(report._id).to.equal(good._id)
        const fields = 'memberId productId price productName'.split(/\s+/)
        fields.forEach(field => {
          expect(report[field]).to.equal(good[field])
        })
      })
    })

    badReports.forEach((bad, i) => {
      describe('ReportsSchema bad parts', () => {
        it(`Fails on BAD Reports insert ${i + 1}`, () => {
          expect(() => Reports.insert(bad)).to.throw()
        })
      })
    })
  })
})
