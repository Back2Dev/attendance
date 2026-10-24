// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Registrations from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.registrations'

const badRegistrations = [
  // no name
  {},
]

const goodRegistrations = []

goodRegistrations.push(Factory.build('registrations'))

describe('registrations', () => {
  goodRegistrations.forEach((good, i) => {
    describe('query database good registrations', () => {
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Registrations.insertAsync(good)
        const thing = await Registrations.findOneAsync(id)
        const fields = ["name","schema","description","active"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badRegistrations.forEach((bad, i) => {
    describe('RegistrationsSchema bad registrations', () => {
      it(`Succeeds on BAD Registrations insert ${i + 1}`, async () => {
        await expect(Registrations.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
