// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Triggers from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.triggers'

const badTriggers = [
  // no name
  {},
]

const goodTriggers = []

goodTriggers.push(Factory.build('triggers'))

describe('triggers', () => {
  goodTriggers.forEach((good, i) => {
    describe('query database good triggers', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Triggers.insert(good)
        if (!id) throw 'Event insert failed'
        const thing = Triggers.findOne(id)
        if (!thing) throw 'Event not found after insert'
        const fields = ['name', 'slug'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badTriggers.forEach((bad, i) => {
    describe('TriggersSchema bad triggers', () => {
      it(`Succeeds on BAD Triggers insert ${i + 1}`, () => {
        expect(() => Triggers.insert(bad)).to.throw()
      })
    })
  })
})
