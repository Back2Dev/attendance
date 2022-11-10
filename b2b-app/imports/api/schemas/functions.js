import SimpleSchema from 'simpl-schema'

const ALLOWED_TYPES = {
  string: String,
  boolean: Boolean,
  integer: SimpleSchema.Integer,
  array: Array,
  object: Object,
  date: Date,
}

/**
 * @typedef {{
 *   name: string;
 *   slug: string;
 *   active: boolean;
 *   fields: {
 *      optional: boolean;
 *      colName: string;
 *      label: string;
 *      type: string;
 *   }[];
 *   extends?: undefined;
 * }} SchemaDocument
 *
 * @typedef {{
 *   children: string[];
 *   schema: SchemaDocument;
 * }} SchemaCompileData
 */

/**
 * @type {Object.<string, SimpleSchema>}
 */
export const compiledSchemas = {}

/**
 * @type {Object.<string, SchemaCompileData>}
 */
export const compileData = {}

/**
 *
 * @param {SchemaDocument[]} schemaDocumentsList
 */
function resolveDataTypesOfSchemaDocuments(schemaDocumentsList) {
  schemaDocumentsList.forEach((schemaDoc) => {
    // Compile all data types
    if (schemaDoc.fields)
      schemaDoc.fields.forEach((field) => {
        if (ALLOWED_TYPES[field.type]) field.type = ALLOWED_TYPES[field.type]
      })
  })
}

export function clearSchemas() {
  Object.keys(compiledSchemas).forEach((key) => {
    delete compiledSchemas[key]
  })
  Object.keys(compileData).forEach((key) => {
    delete compileData[key]
  })
}

/**
 * @param {SchemaCompileData} graphRoot
 */
export function compileSchemaGraphStartingFrom(graphRoot) {
  /**
   * @type {SchemaCompileData[]}
   */
  const compileFrontier = [graphRoot]

  let schemaCompileData
  while ((schemaCompileData = compileFrontier.pop())) {
    let schemaDocument = schemaCompileData.schema
    let compiledSchema = new SimpleSchema(schemaDocument)

    if (schemaDocument.extends)
      compiledSchema = compiledSchema.extend(compiledSchemas[schemaDocument.extends])

    // Factory.define(`schema.${schema.slug}`, Schemas, compiledSchema)
    compiledSchemas[schemaDocument.slug] = compiledSchema
    schemaCompileData.children.forEach((child) => {
      compileFrontier.push(compileData[child])
    })
  }
}

/**
 *
 * @param {SchemaDocument[]} schemaDocumentsList
 * @returns {SchemaCompileData[]}
 */
function buildGraph(schemaDocumentsList) {
  /**
   * @type {SchemaCompileData[]}
   */
  const rootFrontier = []
  schemaDocumentsList.forEach((schema) => {
    if (schema.extends) {
      compileData[schema.extends].children.push(schema.slug)
    } else {
      rootFrontier.push(compileData[schema.slug])
    }
  })
  return rootFrontier
}

/**
 * @param {SchemaDocument[]} schemaDocumentsList
 * @return {{
 * compiledSchemas: Object.<string, SimpleSchema>,
 * compileData: Object.<string, SchemaCompileData>
 * }}
 */
export function compileSchemaDocuments(schemaDocumentsList) {
  resolveDataTypesOfSchemaDocuments(schemaDocumentsList)

  schemaDocumentsList.forEach((schema) => {
    compileData[schema.slug] = {
      schema,
      children: [],
    }
  })

  /**
   * @type {SchemaCompileData[]}
   */
  const rootFrontier = buildGraph(schemaDocumentsList)

  rootFrontier.forEach((graphRoot) => {
    compileSchemaGraphStartingFrom(graphRoot)
  })

  return { compiledSchemas, compileData }
}

export { compileSchemaDocuments as compileSchemas }
