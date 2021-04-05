// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

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
      //  before(resetDatabase)
      it('success if database query matches', () => {
        const id = Messages.insert(good)
        const thing = Messages.findOne(id)
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
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badMessages.forEach((bad, i) => {
    describe('MessagesSchema bad messages', () => {
      it(`Succeeds on BAD Messages insert ${i + 1}`, () => {
        expect(() => Messages.insert(bad)).to.throw()
      })
    })
  })
})
