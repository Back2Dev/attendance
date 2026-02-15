import { expect } from 'chai'
import map2Uniforms from './map2uniforms'
import getSchemas, { evaluate } from '../core/survey-schema-simple'
import testForms from '../test/test-data'
const debug = require('debug')('app:forms-utils')

describe('Utilities: map2uniforms', () => {
  it(`gets the schema`, () => {
    expect(() => {
      debug({ survey: testForms.text1.compiled })
      const schema = map2Uniforms(testForms.text1.compiled)
      getSchemas(schema, {})
    }).not.to.throw()
  })
  testForms.text1.fields.split(/\s+/).forEach((id) => {
    it(`Looks for id ${id}`, () => {
      const schema = map2Uniforms(testForms.text1.compiled)
      const steps = getSchemas(schema, {})
      // debug({ steps })
      const keys = Object.keys(steps[0].schema)
      // debug({ keys })
      expect(keys.includes(id)).to.equal(true)
    })
  })
})
