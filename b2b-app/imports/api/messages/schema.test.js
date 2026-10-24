// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

import Messages from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.messages'

const badMessages = [
  // no name
  {},
]

const goodMessages = []

goodMessages.push(Factory.build('messages'))

describe('messages', () => {
  goodMessages.forEach((good, i) => {
    describe('query database good messages', () => {
      //  before(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await Messages.insertAsync(good)
        const thing = await Messages.findOneAsync(id)
        const fields =
          [
            'message',
            'listingId',
            'propertyId',
            'toId',
            'fromId',
            'status',
            'messageNo',
            'template',
          ] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badMessages.forEach((bad, i) => {
    describe('MessagesSchema bad messages', () => {
      it(`Succeeds on BAD Messages insert ${i + 1}`, async () => {
        await expect(Messages.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
