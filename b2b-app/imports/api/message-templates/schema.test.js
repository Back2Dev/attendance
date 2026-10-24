// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

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
      // beforeEach(() => resetDatabase())
      it('success if database query matches', async () => {
        const id = await MessageTemplates.insertAsync(good)
        const thing = await MessageTemplates.findOneAsync(id)
        const fields = ['name', 'slug', 'number', 'templates', 'templates.$'] || []
        fields.forEach((field) => {
          expect(thing[field]).to.deep.equal(good[field])
        })
      })
    })
  })
  badMessageTemplates.forEach((bad, i) => {
    describe('MessageTemplatesSchema bad messageTemplates', () => {
      it(`Succeeds on BAD MessageTemplates insert ${i + 1}`, async () => {
        await expect(MessageTemplates.insertAsync(bad)).to.be.rejected
      })
    })
  })
})
