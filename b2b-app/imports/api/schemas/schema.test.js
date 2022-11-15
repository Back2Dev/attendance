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
     * @type {string[]}
     */

    // TEST 1
    let errors = []
    let works = false
    errors = performAllDocumentValidations(
      true,
      'core',
      { createdAt: new Date(), updatedAt: new Date() },
      true
    )
    console.log('Test 1:', errors.length !== 0 ? 'FAIL' : 'PASS')

    // TEST 2
    errors = performAllDocumentValidations(true, 'core', {}, true)
    console.log('Test 2:', errors.length === 2 ? 'PASS' : 'FAIL')

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

    errors = performAllDocumentValidations(
      true,
      'bus',
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        seats: 20,
        model: 'Leyland',
        rego: 'HOTWHEELS',
      },
      true
    )
    console.log('Test 4:', errors.length === 1 ? 'PASS' : 'FAIL')

    errors = performAllDocumentValidations(
      true,
      'bus',
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        seats: 20,
        model: 'Leyland',
        rego: 'HOTWHEELS',
        wheels: 6,
      },
      true
    )
    console.log('Test 5:', errors.length === 0 ? 'PASS' : 'FAIL')

    newVehicleSchema = { ...compileData.vehicle.schema }
    newVehicleSchema.extends = undefined

    newCompilations.clear()
    compileEditedSchemaDocs([newVehicleSchema])

    console.log('Test 6:', newCompilations.size === 3 ? 'PASS' : 'FAIL')

    errors = performAllDocumentValidations(
      true,
      'bus',
      {
        seats: 20,
        model: 'Leyland',
        rego: 'HOTWHEELS',
        wheels: 6,
      },
      true
    )
    console.log('Test 7:', errors.length === 0 ? 'PASS' : 'FAIL')
  })
})
