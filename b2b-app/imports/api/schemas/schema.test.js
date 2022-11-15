// schema.test.js
// @ts-check

/* eslint-disable no-unused-expressions */

// import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
/**
 * @typedef {import('./functions').SchemaDocument} SchemaDocument
 */

import Schemas, { SchemaDocuments } from './schema'
// @ts-ignore
import Factory from '/imports/test/factories'
// @ts-ignore
import { assetSchemas } from '/imports/test/schemas.factory'
import {
  initAllSchemaDocuments,
  compiledSchemas,
  newCompilations,
  compileData,
  compileEditedSchemaDocs,
  performAllDocumentValidations,
} from './functions'

const debug = require('debug')('app:schemas-test')

// const badSchemas = [
//   // no name
//   {},
// ]

const goodSchemas = []

goodSchemas.push(Factory.build('schemas'))

describe('schemas', () => {
  // beforeEach(resetDatabase)
  it('create asset schemas', () => {
    // This will insert the asset sub-schemas into the database
    const schemas = assetSchemas()
    debug({ schemas })
    expect(schemas.length).to.equal(6) // There are 6 sub-schemas in the asset list, including intermediate sub-schemas

    // Now Iterate through the sub-schemas
    const allSchemaDocuments = Schemas.find({}).fetch()

    /* Now iterate through them and build complete schema objects, 
    one for each "end" schema, ie Car, Bus Tool
    */
    // @ts-ignore
    initAllSchemaDocuments(allSchemaDocuments)
    Object.keys(compiledSchemas).forEach((slug) => {
      Factory.define(`schema.${slug}`, SchemaDocuments, compiledSchemas[slug])
    })

    /**
     * And finally, validate some test objects against the various schemas
     * - we need to test both success and failure scenarios
     */

    /**
     * @param {number} testNo
     * @param {string} schemaSlug
     * @param {Object.<string, any>} document
     * @param {number} noOfErrors
     * @return {void}
     */
    function testValidation(testNo, schemaSlug, document, noOfErrors) {
      let errors = performAllDocumentValidations(true, schemaSlug, document, true)
      console.log(`Test ${testNo}:`, errors.length === noOfErrors ? 'PASS' : 'FAIL')
    }

    // TEST 1
    testValidation(1, 'core', { createdAt: new Date(), updatedAt: new Date() }, 0)

    // TEST 2
    testValidation(2, 'core', {}, 2)

    newCompilations.clear()

    /**
     * @type {SchemaDocument}
     */
    let newVehicleSchema = { ...compileData.vehicle.schema }
    newVehicleSchema.fields.push({
      colName: 'wheels',
      label: 'No. of Wheels',
      optional: false,
      type: 'integer',
    })
    compileEditedSchemaDocs([newVehicleSchema])
    console.log('Test 3:', newCompilations.size === 3 ? 'PASS' : 'FAIL')

    testValidation(
      4,
      'bus',
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        seats: 20,
        model: 'Leyland',
        rego: 'HOTWHEELS',
      },
      1
    )

    testValidation(
      5,
      'bus',
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        seats: 20,
        model: 'Leyland',
        rego: 'HOTWHEELS',
        wheels: 6,
      },
      0
    )

    newVehicleSchema = { ...compileData.vehicle.schema }
    newVehicleSchema.extends = undefined

    newCompilations.clear()
    compileEditedSchemaDocs([newVehicleSchema])

    console.log('Test 6:', newCompilations.size === 3 ? 'PASS' : 'FAIL')

    testValidation(
      7,
      'bus',
      {
        seats: 20,
        model: 'Leyland',
        rego: 'HOTWHEELS',
        wheels: 6,
      },
      0
    )
  })
})
