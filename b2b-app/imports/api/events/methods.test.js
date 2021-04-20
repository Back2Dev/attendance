import { Meteor } from 'meteor/meteor'
// import { Random } from 'meteor/random'

import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'

import Factory from '/imports/test/factories'
import './methods'

use(assertArrays)

const debug = require('debug')('b2b:events:test')

describe.only('Test book.events method', () => {
  const theMethod = Meteor.server.method_handlers['book.events']
  it('book.events should return an object with status is failed with bad params', () => {
    const badParams = [
      { toolId: 'some string' }, // missing eventId
      { eventId: 'invalid id' }, // not a valid string
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
  it('book.events should fail with not logged in user', () => {
    // create the event
    const event = Factory.build('event')
    debug('build event', event)
    const thisContext = {
      userId: null, // not logged in
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [{ eventId: event._id }])
    }).not.to.throw()
    // debug(result)
    expect(result).to.have.property('status').which.equal('failed')
  })
  it('book.events should work with valid params', () => {
    // create the event
    const course = Factory.create('course')
    const event = Factory.create('event', { courseId: course._id })
    const user = Factory.create('user')
    debug('build event', event)
    debug('build user', user)
    debug('build course', course)
    const thisContext = {
      userId: user._id, // logged in
    }
    let result
    expect(() => {
      result = theMethod.apply(thisContext, [{ eventId: event._id }])
    }).not.to.throw()
    debug({ result })
    expect(result).to.have.property('status').which.equal('success')
  })
})
