// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import StandupNotes from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.standup-notes'

const badStandupNotes = [
  // no name
  {},
]

const goodStandupNotes = []

goodStandupNotes.push(Factory.build('standupNotes'))

describe('standupNotes', () => {
  goodStandupNotes.forEach((good, i) => {
    describe('query database good standupNotes', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = StandupNotes.insert(good)
        const thing = StandupNotes.findOne(id)
        const fields = ["yesterday","today","blockers","userId","userName"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badStandupNotes.forEach((bad, i) => {
    describe('StandupNotesSchema bad standupNotes', () => {
      it(`Succeeds on BAD StandupNotes insert ${i + 1}`, () => {
        expect(() => StandupNotes.insert(bad)).to.throw()
      })
    })
  })
})
