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

  it(`creates a report`, () => {
    expect(() => {
      const id = Meteor.call('report.create', 'Kristy')
      const report = Reports.findOne(id)
    }).not.to.throw()
  })
})
