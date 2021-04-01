import generatePDF from './pdf-generate'
import { expect } from 'chai'
import data from '/imports/ui/hacks/test-pdf-data.json'
import fields from '/imports/ui/hacks/field-settings.json'

describe('generates a pdf with test data', () => {
  it('Runs the function', () => {
    const result = generatePDF({ data: data.bq, fields: fields.bq })
    expect(typeof result).to.be.equal('object')
  })
})
