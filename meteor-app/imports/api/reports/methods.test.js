// no methods yet so no methods.test yet

// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import Reports from './schema'
import Factory from '/imports/test/factories'

describe.only('report.create', () => {
  beforeEach(resetDatabase)

  it(`creates a report with an `, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }

    }).not.to.throw()
  })

  it(`creates a report with an invalid type `, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, "bogus")

    }).to.throw()
  })

  it(`creates a report with an `, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, "section")

    }).not.to.throw()
  })
})
