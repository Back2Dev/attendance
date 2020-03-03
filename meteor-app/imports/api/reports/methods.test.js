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
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'bogus')
    }).to.throw()
  })

  it(`3. creates a report with vailid type selection`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'section')
    }).not.to.throw()
  })
  it(`4. creates a report with invalid optional parameter`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', true, 'section')
    }).to.throw()
  })
  it(`5. creates a report with invalid data type for details field`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: { x: 5 }
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'section')
    }).to.throw()
  })
  it(`6. creates a report with invaild data type for name field`, () => {
    expect(() => {
      const report = {
        name: { x: 5 },
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'section')
    }).to.throw()
  })
  it(`7. creates a report with all invalid data provided`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', 'wrong', 'normal')
    }).to.throw()
  })
  it(`8. creates a report with invalid data type`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', true, 'normal')
    }).to.throw()
  })
  it(`9. creates a report without description`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, [])
    }).to.throw()
  })

  it(`10. creates a report with invalid data type`, () => {
    expect(() => {
      const report = {
        name: 'Minority report',
        details: 'The peasants are revolting'
      }
      const id = Meteor.call('report.create', report)
      Meteor.call('report.push', id, 'Something has happened', null, 'normal')
    }).not.to.throw()
  })
})
