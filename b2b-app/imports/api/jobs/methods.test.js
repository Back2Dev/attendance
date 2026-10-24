import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'

import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'
// import faker from 'faker'

import Factory from '/imports/test/factories'
// import Profiles from '/imports/api/profiles/schema.js'
import './methods'

use(assertArrays)

const debug = require('debug')('app:jobs:test')

describe('Test jobs.markAsPaid method', () => {
  const theMethod = Meteor.server.method_handlers['jobs.markAsPaid']
  it('jobs.markAsPaid should return an object with status is failed with bad params', async () => {
    const badParams = [
      { id: null }, // missing id
    ]
    for (const item of badParams) {
      const thisContext = {
        userId: null,
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    }
  })
  it('jobs.markAsPaid should return an object with status is failed with not logged in user', async () => {
    const goodParams = [{ id: Random.id() }]
    for (const item of goodParams) {
      const thisContext = {
        userId: null, // not logged in user
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    }
  })
  it('jobs.markAsPaid should return an object with status is failed with not found job id', async () => {
    const user = await Factory.createAsync('UserGRE')
    const goodParams = [
      {
        id: Random.id(), // unable to find this
      },
    ]
    for (const item of goodParams) {
      const thisContext = {
        userId: user._id,
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    }
  })
  it('jobs.markAsPaid should work with valid job id and user', async () => {
    const user = await Factory.createAsync('UserGRE')
    const job = await Factory.createAsync('jobs')
    const goodParams = [
      {
        id: job._id,
      },
    ]
    for (const item of goodParams) {
      const thisContext = {
        userId: user._id,
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
    }
  })
})

describe('Test jobs.markAsUnPaid method', () => {
  const theMethod = Meteor.server.method_handlers['jobs.markAsUnPaid']
  it('jobs.markAsUnPaid should return an object with status is failed with bad params', async () => {
    const badParams = [
      { id: null }, // missing id
    ]
    for (const item of badParams) {
      const thisContext = {
        userId: null,
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    }
  })
  it('jobs.markAsUnPaid should return an object with status is failed with not logged in user', async () => {
    const goodParams = [{ id: Random.id() }]
    for (const item of goodParams) {
      const thisContext = {
        userId: null, // not logged in user
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    }
  })
  it('jobs.markAsUnPaid should return an object with status is failed with not found job id', async () => {
    const user = await Factory.createAsync('UserGRE')
    const goodParams = [
      {
        id: Random.id(), // unable to find this
      },
    ]
    for (const item of goodParams) {
      const thisContext = {
        userId: user._id,
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('failed')
    }
  })
  it('jobs.markAsUnPaid should work with valid job id and user', async () => {
    const user = await Factory.createAsync('UserGRE')
    const job = await Factory.createAsync('jobs', { paid: true })
    const goodParams = [
      {
        id: job._id,
      },
    ]
    for (const item of goodParams) {
      const thisContext = {
        userId: user._id,
      }
      let result
      result = await theMethod.apply(thisContext, [item])
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
    }
  })
})
