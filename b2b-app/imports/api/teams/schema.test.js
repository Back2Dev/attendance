// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Teams from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.teams'

const badTeams = [
  // no name
  {},
]

const goodTeams = []

goodTeams.push(Factory.build('teams'))

describe('teams', () => {
  goodTeams.forEach((good, i) => {
    describe('query database good teams', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Teams.insert(good)
        const thing = Teams.findOne(id)
        const fields = ["name","devs"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badTeams.forEach((bad, i) => {
    describe('TeamsSchema bad teams', () => {
      it(`Succeeds on BAD Teams insert ${i + 1}`, () => {
        expect(() => Teams.insert(bad)).to.throw()
      })
    })
  })
})
