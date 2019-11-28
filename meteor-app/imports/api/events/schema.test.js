// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Events, { defaultObject } from './schema'
import Factory from '/imports/test/factories'

const badEvents = [
  // no name
  {
    productId: 'asdf23asdf',
    duration: 5,
    active: false
  },
  // no duration
  {
    name: 'asdf9kj98',
    active: true
  },
  // no active flag
  {
    name: 'asdf9kj98',
    duration: 2
  }
]

const goodEvents = [
  {
    name: 'Group Kayak',
    duration: 2,
    active: true,
    type: 'day'
  }
]

goodEvents.push(Factory.build('event'))
goodEvents.push(defaultObject)

describe.only('events', () => {
  beforeEach(resetDatabase)

  goodEvents.forEach((good, i) => {
    describe('EventsSchema good events', () => {
      it(`Succeeds on GOOD Events insert ${i + 1}`, () => {
        expect(() => Events.insert(good)).not.to.throw()
      })
    })

    describe('query database good event', () => {
      it('success if database query matches', () => {
        const eventId = Events.insert(good)
        const event = Events.findOne(eventId)
        expect(event._id).to.equal(good._id)
        const fields = 'name duration active'.split(/\s+/)
        fields.forEach(field => {
          expect(event[field]).to.equal(good[field])
        })
      })
    })

    badEvents.forEach((bad, i) => {
      describe('EventsSchema bad parts', () => {
        it(`Succeeds on BAD Events insert ${i + 1}`, () => {
          expect(() => Events.insert(bad)).to.throw()
        })
      })
    })
  })
})
