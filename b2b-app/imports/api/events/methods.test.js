import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'

import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'
import faker from 'faker'

import Factory from '/imports/test/factories'
import Profiles from '/imports/api/profiles/schema.js'
import './methods'

use(assertArrays)

const debug = require('debug')('app:events:test')

describe('Test book.events method', () => {
  const theMethod = Meteor.server.method_handlers['book.events']
  it('book.events should return an object with status is failed with bad params', async () => {
    const badParams = [
      { toolId: 'some string' }, // missing eventId
      { eventId: 'invalid id' }, // not a valid string
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
  it('book.events should fail with not logged in user', async () => {
    // create the event
    const event = Factory.build('event')
    debug('build event', event)
    const thisContext = {
      userId: null, // not logged in
    }
    let result
    result = await theMethod.apply(thisContext, [{ eventId: event._id }])
    // debug(result)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('book.events should work with valid params', async () => {
    // create the event
    const course = await Factory.createAsync('location')
    const event = await Factory.createAsync('event', { locationId: course._id })
    const user = await Factory.createAsync('user')
    debug('build event', event)
    debug('build user', user)
    debug('build course', course)
    const thisContext = {
      userId: user._id, // logged in
    }
    let result
    result = await theMethod.apply(thisContext, [{ eventId: event._id }])
    debug({ result })
    expect(result).to.have.property('status').which.equal('success')
  })
})
describe('Test cancel.events method', () => {
  const theMethod = Meteor.server.method_handlers['cancel.events']
  it('cancel.events should return an object with status is failed with bad params', async () => {
    const badParams = [
      { bookingId: 'some string' }, // missing eventId
      { someParam: 'some value' }, // bookingId is missing
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
  it('cancel.events should fail with not logged in user', async () => {
    const thisContext = {
      userId: null, // not logged in
    }
    let result
    result = await theMethod.apply(thisContext, [{ bookingId: Random.id() }])
    // debug(result)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('cancel.events should work with valid params', async () => {
    // create the event
    const course = await Factory.createAsync('location')
    const event = await Factory.createAsync('event', { locationId: course._id })
    const user = await Factory.createAsync('user')
    const member = await Profiles.findOneAsync({ userId: user._id })
    const session = await Factory.createAsync('session', {
      eventId: event._id,
      profileId: member._id,
      memberName: member.name,
    })
    debug('build event', event)
    debug('build user', user)
    debug('build session', session)
    const thisContext = {
      userId: user._id, // logged in
    }
    let result
    result = await theMethod.apply(thisContext, [{ bookingId: session._id }])
    debug({ result })
    expect(result).to.have.property('status').which.equal('success')
  })
})
describe('Test insert.events method', () => {
  const theMethod = Meteor.server.method_handlers['insert.events']
  it('insert.events should works good params', async () => {
    const course = await Factory.createAsync('location')
    const backupCourse = await Factory.createAsync('location')
    const goodParams = [
      {
        name: faker.address.cityName(),
        description: faker.lorem.paragraph(),
        type: 'once',
        status: 'active',
        duration: 3,
      },
      {
        name: faker.address.cityName(),
        description: faker.lorem.paragraph(),
        type: 'once',
        status: 'active',
        duration: 3,
        locationId: course._id,
      },
      {
        name: faker.address.cityName(),
        description: faker.lorem.paragraph(),
        type: 'once',
        status: 'active',
        duration: 3,
        locationId: course._id,
        backupLocationId: backupCourse._id,
      },
    ]
    for (const item of goodParams) {
      const thisContext = {
        userId: null,
      }
      let result
      result = await theMethod.apply(thisContext, [{ form: item }])
      // debug(result)
      expect(result).to.have.property('status').which.equal('success')
    }
  })
})
