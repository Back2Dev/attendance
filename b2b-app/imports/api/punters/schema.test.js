// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Punters from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.punters'

const badPunters = [
  // no name
  {},
]

const goodPunters = []

goodPunters.push(Factory.build('punters'))

describe('punters', () => {
  goodPunters.forEach((good, i) => {
    describe('query database good punters', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Punters.insert(good)
        const thing = Punters.findOne(id)
        const fields = ["memberNo","name","directDebit","guestCard","pre79Card","carPass","subscription","payByInstalments","item1","item1Pmt","item2","item2Pmt","item3","item3Pmt","item4","item4Pmt","item5","item5Pmt","firstName","lastName","status","statusReason"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badPunters.forEach((bad, i) => {
    describe('PuntersSchema bad punters', () => {
      it(`Succeeds on BAD Punters insert ${i + 1}`, () => {
        expect(() => Punters.insert(bad)).to.throw()
      })
    })
  })
})
