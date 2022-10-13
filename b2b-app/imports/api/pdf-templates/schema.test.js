// schema.test.js

/* eslint-disable no-unused-expressions */

import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import PdfTemplates from './schema'
import Factory from '/imports/test/factories'
import '/imports/test/factory.pdf-templates'

const badPdfTemplates = [
  // no name
  {},
]

const goodPdfTemplates = []

goodPdfTemplates.push(Factory.build('pdfTemplates'))

describe('pdfTemplates', () => {
  goodPdfTemplates.forEach((good, i) => {
    describe('query database good pdfTemplates', () => {
      // beforeEach(resetDatabase)
      it('success if database query matches', () => {
        const id = PdfTemplates.insert(good)
        const thing = PdfTemplates.findOne(id)
        const fields = ["name","revision","description","active","source"] || []
        fields.forEach((field) => {
          expect(thing[field]).to.equal(good[field])
        })
      })
    })
  })
  badPdfTemplates.forEach((bad, i) => {
    describe('PdfTemplatesSchema bad pdfTemplates', () => {
      it(`Succeeds on BAD PdfTemplates insert ${i + 1}`, () => {
        expect(() => PdfTemplates.insert(bad)).to.throw()
      })
    })
  })
})
