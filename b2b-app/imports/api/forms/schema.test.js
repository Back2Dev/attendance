// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Forms from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.forms'

const badForms = [
  // no name
  {},
]

const goodForms = []

goodForms.push(Factory.build('forms'))

describe('forms', () => {
  goodForms.forEach((good, i) => {
    describe('query database good forms', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = Forms.insert(good)
        const thing = Forms.findOne(id)
        const fields = ["name","slug","source","survey","revision","active"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badForms.forEach((bad, i) => {
    describe('FormsSchema bad forms', () => {
      it(`Succeeds on BAD Forms insert ${i + 1}`, () => {
        expect(() => Forms.insert(bad)).to.throw()
      })
    })
  })
})
