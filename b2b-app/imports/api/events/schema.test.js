// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Events, { defaultObject } from './schema'
import Factory from '/imports/test/factories'

const badEvents = [
  // no name
  {
    productId: 'asdf23asdf',
    duration: 5,
  },
  // no duration
  {
    name: 'asdf9kj98',
  },
]

const goodEvents = [
  {
    name: 'Group Kayak',
    duration: 2,
    status: 'active',
    type: 'day',
  },
]

goodEvents.push(Factory.build('event'))
goodEvents.push(defaultObject)

describe('events', () => {
  beforeEach(async (done) => {
    await resetDatabase()
    done()
  })

  goodEvents.forEach((good, i) => {
    describe('EventsSchema good events', () => {
      it(`Succeeds on GOOD Events insert ${i + 1}`, async () => {
        await expect(Events.insertAsync(good)).to.be.fulfilled
      })
    })

    describe('query database good event', () => {
      it('success if database query matches', async () => {
        const eventId = await Events.insertAsync(good)
        const event = await Events.findOneAsync(eventId)
        expect(event._id).to.equal(good._id)
        const fields = 'name duration active'.split(/\s+/)
        fields.forEach((field) => {
          expect(event[field]).to.equal(good[field])
        })
      })
    })

    badEvents.forEach((bad, i) => {
      describe('EventsSchema bad parts', () => {
        it(`Succeeds on BAD Events insert ${i + 1}`, async () => {
          await expect(Events.insertAsync(bad)).to.be.rejected
        })
      })
    })
  })
})
