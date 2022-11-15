// @ts-check
import SimpleSchema from 'simpl-schema'
import {
  OptionalRegExId,
  // @ts-ignore
} from '/imports/api/utils/schema-util'
import { ALLOWED_TYPES } from './schema'
/**
 * @typedef {import('simpl-schema').SimpleSchemaDefinition} SimpleSchemaDefinition
 */

/**
 * @typedef {'string' | 'boolean' | 'integer' | 'array' | 'object' | 'date' | 'foreignKey'} AllowedType
 * @typedef {{
 *   colName: string;
 *   label: string;
 *   type: AllowedType;
 *   defaultValue?: string;
 *   optional: boolean;
 *   isFieldValueLocked?: boolean;
 *   relatedCollection?: string; // For foreign key fields only
 *   displayFormat?: string; // For foreign key fields and object fields only
 * }} SchemaDocumentField
 *
 * TODO: Change extends if implementing multiple inheritance
 * @typedef {{
 *   name: string;
 *   slug: string;
 *   active: boolean;
 *   fields: SchemaDocumentField[];
 *   extends?: string;
 *   isDocumentInsertLocked?: boolean;
 *   isSchemaEditLocked?: boolean;
 *   createdAt: Date;
 *   updatedAt: Date;
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
 * Contains only the newly edited sources before they are compiled
 * @type {Set<string>}
 */
const editedSources = new Set()

/**
 * Contains the newly compiled sources after they are compiled, until cleared
 * @type {Set<string>}
 */
export const newCompilations = new Set()

/**
 * Resolves the relevant field's default value
 * @param {SchemaDocumentField} field
 */
function resolveDefaultValueOfField(field) {
  if (!field.defaultValue) {
    return undefined
  }
  switch (field.type) {
    case 'string':
    case 'foreignKey':
      return field.defaultValue
    case 'boolean':
      return field.defaultValue.toLowerCase() === 'true'
    case 'integer':
      return ~~field.defaultValue
    case 'array':
    case 'object':
      try {
        return JSON.parse(field.defaultValue)
      } catch (e) {
        return undefined
      }
    case 'date':
      try {
        return new Date(field.defaultValue)
      } catch (e) {
        return undefined
      }
  }
}

/**
 * Compiles the schema object into a SimpleSchema and returns that
 * @param {SchemaDocument} schemaDocument
 * @return {SimpleSchema}
 */
function compileSchemaObject(schemaDocument) {
  /**
   * @type {SimpleSchemaDefinition}
   */
  const assembledObject = {}
  assembledObject._id = OptionalRegExId
  if (schemaDocument.fields)
    schemaDocument.fields.forEach((field) => {
      // eslint-disable-next-line no-unused-vars
      const { colName, label, optional } = field
      const assembledField = {
        label,
        optional,
        type: resolveDataTypeOfField(field),
        defaultValue: resolveDefaultValueOfField(field),
      }
      assembledObject[colName] = assembledField
    })
  return new SimpleSchema(assembledObject)
}

/**
 * Matches the string datatypes of the given field with the correct type expected by simple schema
 * @param {SchemaDocumentField} field
 */
function resolveDataTypeOfField(field) {
  if (ALLOWED_TYPES[field.type]) return ALLOWED_TYPES[field.type]
  return undefined
}

/**
 * Deletes all schemas and makes the root frontier, compiledSchemas and compileData blank slates
 */
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

    editedSources.delete(schemaDocument.slug)
    newCompilations.add(schemaDocument.slug)

    let compiledSchema = compileSchemaObject(schemaDocument)

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
    } else {
      compileData[schema.slug].schema = schema
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

    // Delete from root frontier if this is a root
    rootFrontier.delete(slug)

    parents.forEach((parentSlug) => {
      if (compileData[parentSlug]) {
        compileData[parentSlug].children.delete(slug)
      }
    })
    parents.clear()
  })
}

/**
 * Links edited sources to the appropriate parent(used when sources are edited)
 */
function linkEditedSourcesToParents() {
  editedSources.forEach((slug) => {
    const schemaDoc = compileData[slug].schema
    // TODO: Change here if implementing multiple inheritance
    const parents = [schemaDoc.extends].filter((parent) => !!parent)

    if (parents.length === 0) rootFrontier.add(slug)

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
  clearSchemas()
  compileEditedSchemaDocs(schemaDocumentsList)
}

/**
 * Can be called with one or more schema documents, to compile the edited schemas, ideally once edited,
 * as this is a full compilation which is more resource intensive. All previous compilations
 * are retained unless they within the schema documents provided, or extend the schema documents provided.
 * @param {SchemaDocument[]} schemaDocumentsList
 */
export function compileEditedSchemaDocs(schemaDocumentsList) {
  setSources(schemaDocumentsList)

  relinkEditedSourcesToParents()

  countCompilableParents()

  const newRootFrontier = findCompilableRoots()

  newRootFrontier.forEach((graphRoot) => {
    compileSchemaGraphStartingFrom(graphRoot)
  })
}

/**
 * Checks whether the given user can store a document in the relevant document store
 * under the given schema.
 * @param {boolean} isSuperAdmin
 * @param {string} schemaSlug
 * @return {boolean}
 */
export function canStoreDocument(isSuperAdmin, schemaSlug) {
  return isSuperAdmin || compileData[schemaSlug].schema.isDocumentInsertLocked
}

function extractErrors(e) {
  return e.details.map((err) => err.message)
}

/**
 * Validates the given document against the compiled schema of the given slug
 * @param {string} schemaSlug
 * @param {Object.<string, any>} document
 * @return {string[]} Empty array if valid, array with errors otherwise
 */
export function validateDocumentAgainstSchema(schemaSlug, document) {
  try {
    compiledSchemas[schemaSlug].validate(document)
    return []
  } catch (e) {
    return extractErrors(e)
  }
}

/**
 * Prepares all locked fields for insert or update.
 * If this is used to prepare for insert, then default fields will be used as the value.
 * Else, it will simply be deleted.
 * @param {string} schemaSlug
 * @param {{ [x: string]: any; }} [changes]
 */
function deleteAllLockedFields(schemaSlug, changes) {
  compileData[schemaSlug].schema.fields.forEach((field) => {
    if (field.isFieldValueLocked) {
      delete changes[field.colName]
    }
  })
}

function resolveDefaultValuesForInsert(schemaSlug, changes) {
  compileData[schemaSlug].schema.fields.forEach((field) => {
    const defaultValue = resolveDefaultValueOfField(field)
    if (changes[field.colName] == undefined && defaultValue != undefined) {
      changes[field.colName] = defaultValue
    }
  })
}
