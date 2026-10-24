// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import StandupNotes from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.standup-notes'
import '/imports/test/factory.standups'
import '/imports/test/factory.teams'

const badStandupNotes = [
  // no name
  {},
]

const goodStandupNotes = []

goodStandupNotes.push(Factory.build('standupNotes'))

describe('standupNotes', () => {
  goodStandupNotes.forEach((good, i) => {
    describe('query database good standupNotes', () => {
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await StandupNotes.insertAsync(good)
        const thing = await StandupNotes.findOneAsync(id)
        const fields = ['yesterday', 'today', 'blockers', 'userId', 'userName'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badStandupNotes.forEach((bad, i) => {
    describe('StandupNotesSchema bad standupNotes', () => {
      it(`Succeeds on BAD StandupNotes insert ${i + 1}`, async () => {
        await expect(StandupNotes.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
