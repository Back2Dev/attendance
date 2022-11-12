// @ts-check
import SimpleSchema from 'simpl-schema'
/**
 * @typedef {import('simpl-schema').SimpleSchemaDefinition} SimpleSchemaDefinition
 */

const ALLOWED_TYPES = {
  string: String,
  boolean: Boolean,
  integer: SimpleSchema.Integer,
  array: Array,
  object: Object,
  date: Date,
}

/**
 * TODO: Change extends if implementing multiple inheritance
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
 *   extends?: string;
 * }} SchemaDocument
 *
 * @typedef {{
 *   children: Set<string>;
 *   schema: SchemaDocument;
 *   parents: Set<string>;
 *   parentsRemainingToCompile: number;
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
 * @type {Set<string>}
 */
export const rootFrontier = new Set()

/**
 * Contains only the newly edited sources
 * @type {Set<string>}
 */
const editedSources = new Set()

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
  rootFrontier.clear()
  Object.keys(compiledSchemas).forEach((key) => {
    delete compiledSchemas[key]
  })
  Object.keys(compileData).forEach((key) => {
    delete compileData[key]
  })
}

/**
 * @param {string} graphRoot
 */
export function compileSchemaGraphStartingFrom(graphRoot) {
  /**
   * @type {SchemaCompileData[]}
   */
  const compileFrontier = [compileData[graphRoot]]

  /**
   * @type {SchemaCompileData}
   */
  let schemaCompileData
  while ((schemaCompileData = compileFrontier.pop())) {
    let schemaDocument = schemaCompileData.schema

    // @ts-ignore
    let compiledSchema = new SimpleSchema(schemaDocument)

    schemaCompileData.parents.forEach((parent) => {
      compiledSchema = compiledSchema.extend(compiledSchemas[parent])
    })

    // Factory.define(`schema.${schema.slug}`, Schemas, compiledSchema)
    compiledSchemas[schemaDocument.slug] = compiledSchema
    schemaCompileData.children.forEach((child) => {
      let remaining = Math.max(compileData[child].parentsRemainingToCompile - 1, 0)
      compileData[child].parentsRemainingToCompile = remaining
      if (remaining <= 0) compileFrontier.push(compileData[child])
    })
  }
}

/**
 * Sets the source schemas/schema documents to be compiled later on.
 * This does not replace the compiled schemas until compileSchemaGraphStartingFrom
 * function is called, and does not build the graph until build graph is called.
 * @param {SchemaDocument[]} schemaDocumentsList
 */
function setSources(schemaDocumentsList) {
  schemaDocumentsList.forEach((schema) => {
    // Check if it is a newly added schema
    if (!compileData[schema.slug]) {
      // If it is create the new schema compile data
      compileData[schema.slug] = {
        schema,
        children: new Set(),
        parents: new Set(),
        parentsRemainingToCompile: 0,
      }
    }
    editedSources.add(schema.slug)
  })
}

/**
 * Finds the roots of the graph consisting of only roots to be compiled
 * @returns {string[]}
 */
function findCompilableRoots() {
  /**
   * @type {string[]}
   */
  const roots = []
  editedSources.forEach((slug) => {
    if (compileData[slug].parentsRemainingToCompile <= 0) {
      roots.push(slug)
    }
  })
  return roots
}

/**
 * Counts all the compilable parents of all schemas
 */
function countCompilableParents() {
  // First set all compilable parents to 0 so that this function
  // counts correctly
  editedSources.forEach((slug) => {
    compileData[slug].children.forEach((childSlug) => {
      compileData[childSlug].parentsRemainingToCompile = 0
    })
  })

  // Then count all the parents to be compiled for each child
  editedSources.forEach((slug) => {
    compileData[slug].children.forEach((childSlug) => {
      compileData[childSlug].parentsRemainingToCompile += 1
    })
  })
}

/**
 * Unlinks edited sources from the parent(used when sources are edited)
 */
function unlinkEditedSourcesFromParents() {
  editedSources.forEach((slug) => {
    const { parents } = compileData[slug]

    parents.forEach((parentSlug) => {
      if (compileData[parentSlug]) {
        compileData[parentSlug].children.delete(slug)
      }
    })
  })
}

/**
 * Links edited sources to the appropriate parent(used when sources are edited)
 */
function linkEditedSourcesToParents() {
  editedSources.forEach((slug) => {
    const schemaDoc = compileData[slug].schema
    // TODO: Change here if implementing multiple inheritance
    const parents = [schemaDoc.extends]

    parents.forEach((parentSlug) => {
      if (compileData[parentSlug]) {
        compileData[parentSlug].children.add(schemaDoc.slug)
        compileData[schemaDoc.slug].parents.add(parentSlug)
      }
    })
  })
}

/**
 * Unlinks and re-links edited sources to the appropriate parent(used when sources are edited).
 */
function relinkEditedSourcesToParents() {
  unlinkEditedSourcesFromParents()
  linkEditedSourcesToParents()
}

/**
 * Should be called with all schema documents, to initialize the schemas, ideally only once,
 * as this is a full compilation which is more resource intensive. All previous compilations
 * are cleared off.
 * @param {SchemaDocument[]} schemaDocumentsList
 */
export function initAllSchemaDocuments(schemaDocumentsList) {
  resolveDataTypesOfSchemaDocuments(schemaDocumentsList)

  setSources(schemaDocumentsList)

  relinkEditedSourcesToParents()

  countCompilableParents()

  const newRootFrontier = findCompilableRoots()

  // Since everything is being compiled now, all new found roots are root components
  newRootFrontier.forEach((rootSchemaDoc) => rootFrontier.add(rootSchemaDoc))

  newRootFrontier.forEach((graphRoot) => {
    compileSchemaGraphStartingFrom(graphRoot)
  })
}

export { initAllSchemaDocuments as compileSchemas }
