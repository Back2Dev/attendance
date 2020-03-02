

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import Reports from './schema'
import Factory from '/imports/test/factories'
const debug = require('debug')('b2b:reports-test')

describe.only('report.create', () => {
  beforeEach(resetDatabase)

  it(`1. creates a report with name and details provided correctly`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
    }).not.to.throw()
  })

  it(`2. creates a report with an invalid type `, () => {
    expect(() => {
      debug('22')
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'bogus')
      debug('2')
    }).to.throw()
  })

  it(`creates a report with vailid type selection`, () => {
    expect(() => {
      debug('33')
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'section')
      debug('3')
    }).not.to.throw()
  })
  it(`creates a report with invalid optional parameter`, () => {
    expect(() => {
      debug('44')
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', true, 'section')
      debug('4')
    }).to.throw()
  })
  it(`creates a report with invalid data type for details field`, () => {
    expect(() => {
      debug('55')
      const report = {
        name: 'Minority report',
        details: { x: 5 }
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'section')
      debug('5')
    }).to.throw()
  })
  it(`creates a report with invaild data type for name field`, () => {
    expect(() => {
      debug('66')
      const report = {
        name: { x: 5 },
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'section')
      debug('6')
    }).to.throw()
  })
  it(`creates a report with all invalid data provided`, () => {
    expect(() => {
      debug('77')
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', 'wrong', 'normal')
      debug('7')
    }).to.throw()
  })
  it(`creates a report with invalid data type`, () => {
    expect(() => {
      debug('88')
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', true, 'normal')
      debug('8')
    }).to.throw()
  })
  it(`creates a report without description`, () => {
    expect(() => {
      debug('99')
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, [])
      debug('9')
    }).to.throw()
  })

  it(`creates a report with invalid data type`, () => {
    expect(() => {
      debug('10')
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'normal')
      debug('101')
    }).not.to.throw()
  })
})
