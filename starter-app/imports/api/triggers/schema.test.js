// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Events from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.events'

const badEvents = [
  // no name
  {},
]

const goodEvents = []

goodEvents.push(Factory.build('events'))

describe('events', () => {
  goodEvents.forEach((good, i) => {
    describe('query database good events', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Events.insert(good)
        if (!id) throw 'Event insert failed'
        const thing = Events.findOne(id)
        if (!thing) throw 'Event not found after insert'
        const fields = ['name', 'slug'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badEvents.forEach((bad, i) => {
    describe('EventsSchema bad events', () => {
      it(`Succeeds on BAD Events insert ${i + 1}`, () => {
        expect(() => Events.insert(bad)).to.throw()
      })
    })
  })
})
