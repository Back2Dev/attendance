import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'

import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'
import faker from 'faker'

import Factory from '/imports/test/factories'
import Members from '/imports/api/members/schema.js'
import './methods'

use(assertArrays)

const debug = require('debug')('app:jobs:test')

describe('Test jobs.markAsPaid method', () => {
  const theMethod = Meteor.server.method_handlers['jobs.markAsPaid']
  it('jobs.markAsPaid should return an object with status is failed with bad params', () => {
    const badParams = [
      { id: null }, // missing id
    ]
    badParams.map((item) => {
      const thisContext = {
        userId: null,
      }
      let result
      expect(() => {
        result = theMethod.apply(thisContext, [item])
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
  })
  it('jobs.markAsPaid should return an object with status is failed with not logged in user', () => {
    const goodParams = [{ id: Random.id() }]
    goodParams.map((item) => {
      const thisContext = {
        userId: null, // not logged in user
      }
      let result
      expect(() => {
        result = theMethod.apply(thisContext, [item])
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
  })
  it('jobs.markAsPaid should return an object with status is failed with not found job id', () => {
    const user = Factory.create('UserGRE')
    const goodParams = [
      {
        id: Random.id(), // unable to find this
      },
    ]
    goodParams.map((item) => {
      const thisContext = {
        userId: user._id,
      }
      let result
      expect(() => {
        result = theMethod.apply(thisContext, [item])
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    })
  })
  it('jobs.markAsPaid should work with valid job id and user', () => {
    const user = Factory.create('UserGRE')
    const job = Factory.create('jobs')
    const goodParams = [
      {
        id: job._id,
      },
    ]
    goodParams.map((item) => {
      const thisContext = {
        userId: user._id,
      }
      let result
      expect(() => {
        result = theMethod.apply(thisContext, [item])
      }).not.to.throw()
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
    })
  })
})
