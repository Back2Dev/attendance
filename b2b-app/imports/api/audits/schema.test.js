// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Audits from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.audits'

const badAudits = [
  // no name
  {},
  {
    name: 'Something will not work',
  },
]

const goodAudits = [
  {
    event: 'Something happened',
    user: 'Random user id',
  },
  {
    event: 'Something else happened',
    user: 'Random user id',
    data: ['Hello', 'Goodbye'],
  },
  {
    event: 'Something else happened',
    user: 'Random user id',
    data: 'Hello',
  },
  {
    event: 'Something else happened',
    user: 'Random user id',
    data: { message: 'Hello' },
  },
]

goodAudits.push(Factory.build('audits'))

describe('audits', () => {
  goodAudits.forEach((good, i) => {
    describe('query database good audits', () => {
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Audits.insertAsync(good)
        const thing = await Audits.findOneAsync(id)
        const fields = ['event', 'user'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badAudits.forEach((bad, i) => {
    describe('AuditsSchema bad audits', () => {
      it(`Throws on BAD Audits insert ${i + 1}`, async () => {
        await expect(Audits.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
