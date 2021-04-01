// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import MessageTemplates from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.message-templates'

const badMessageTemplates = [
  // no name
  {},
]

const goodMessageTemplates = []

goodMessageTemplates.push(Factory.build('messageTemplates'))

describe('messageTemplates', () => {
  goodMessageTemplates.forEach((good, i) => {
    describe('query database good messageTemplates', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = MessageTemplates.insert(good)
        const thing = MessageTemplates.findOne(id)
        const fields = ['name', 'slug', 'number', 'templates', 'templates.$'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badMessageTemplates.forEach((bad, i) => {
    describe('MessageTemplatesSchema bad messageTemplates', () => {
      it(`Succeeds on BAD MessageTemplates insert ${i + 1}`, () => {
        expect(() => MessageTemplates.insert(bad)).to.throw()
      })
    })
  })
})
