// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Teams.insertAsync(good)
        const thing = await Teams.findOneAsync(id)
        const fields = ["name","devs"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badTeams.forEach((bad, i) => {
    describe('TeamsSchema bad teams', () => {
      it(`Succeeds on BAD Teams insert ${i + 1}`, async () => {
        await expect(Teams.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
