// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Settings from './schema'
import Factory from '/imports/test/factories'

const badSettings = [
  // no name
  {}
]

const goodSettings = []

goodSettings.push(Factory.build('settings'))

describe('settings', () => {
  beforeEach(resetDatabase)

  goodSettings.forEach((good, i) => {
    describe('SettingsSchema good docs', () => {
      it(`Succeeds on GOOD Settings insert ${i + 1}`, () => {
        expect(() => Settings.insert(good)).not.to.throw()
      })
    })

    describe('query database good event', () => {
      it('success if database query matches', () => {
        const id = Settings.insert(good)
        const thing = Settings.findOne(id)
        expect(thing._id).to.equal(good._id)
        // Templated replacement...
        const fields = ['name', 'type', 'key', 'value'] || []
        fields.forEach(field => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })

    badSettings.forEach((bad, i) => {
      describe('SettingsSchema bad parts', () => {
        it(`Succeeds on BAD Settings insert ${i + 1}`, () => {
          expect(() => Settings.insert(bad)).to.throw()
        })
      })
    })
  })
})
