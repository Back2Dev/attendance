// @ts-check
import SimpleSchema from 'simpl-schema'
import {
  OptionalRegExId,
  // @ts-ignore
} from '/imports/api/utils/schema-util'
import { ALLOWED_TYPES } from './schema'
/**
 * @typedef {import('simpl-schema').SimpleSchemaDefinition} SimpleSchemaDefinition
 * @typedef {import('simpl-schema').ValidationOption} ValidationOption
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
 *   _id: string;
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
export function compileSchemaObject(schemaDocument) {
  /**
   * @type {SimpleSchemaDefinition}
   */
  const assembledObject = {}
  assembledObject._id = OptionalRegExId
  if (schemaDocument.fields)
    schemaDocument.fields.forEach((field) => {
      // eslint-disable-next-line no-unused-vars
      const { colName, label, optional, type } = field
      /**
       * @type {{ label: string; optional: boolean; type: DateConstructor | BooleanConstructor | StringConstructor | ArrayConstructor | "SimpleSchema.Integer" | ObjectConstructor; defaultValue?: any; }}
       */
      let assembledField = {
        label,
        optional,
        type: resolveDataTypeOfField(field),
        defaultValue: resolveDefaultValueOfField(field),
      }
      assembledObject[colName] = assembledField
      if (type === 'array') {
        assembledField = {
          label,
          optional,
          type: ALLOWED_TYPES.string,
        }
        assembledObject[colName + '.$'] = assembledField
      }
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
      // Change only the actual new changes of the schema document while retaining the old unchanged ones
      const oldSchema = compileData[schema.slug].schema
      Object.keys(schema).forEach((key) => {
        oldSchema[key] = schema[key]
      })
    }
    if (!compileData[schema.slug].schema.fields) {
      compileData[schema.slug].schema.fields = []
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
 * @param {ValidationOption} options
 * @return {string[]} Empty array if valid, array with errors otherwise
 */
export function validateDocumentAgainstSchema(schemaSlug, document, options) {
  try {
    compiledSchemas[schemaSlug].validate(document, options)
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

/**
 * Returns the set of fields for the given schema
 * @param {string} schemaSlug
 * @returns {Set<string>}
 */
function getFieldsSet(schemaSlug) {
  const fields = new Set()
  const frontier = [compileData[schemaSlug]]
  const checkedParents = new Set([schemaSlug])
  /**
   * @type {SchemaCompileData}
   */
  let schemaData
  while ((schemaData = frontier.pop())) {
    schemaData.schema.fields.forEach((field) => {
      fields.add(field.colName)
    })
    schemaData.parents.forEach((schemaSlug) => {
      if (!checkedParents.has(schemaSlug)) {
        frontier.push(compileData[schemaSlug])
        checkedParents.add(schemaSlug)
      }
    })
  }
  return fields
}

/**
 * Prepares all for insert/update by deleting the unnecessary fields in the given changes.
 * @param {string} schemaSlug
 * @param {{ [x: string]: any; }} [changes]
 */
function deleteAllUnnecessaryFields(schemaSlug, changes) {
  const fields = getFieldsSet(schemaSlug)
  Object.keys(changes).forEach((colName) => {
    if (!fields.has(colName)) {
      delete changes[colName]
    }
  })
}

/**
 *
 * @param {boolean} isSuperAdmin Whether the user performing the operation is a super admin
 * @param {string} schemaSlug What is the slug of the schema/collection being inserted into or updated?
 * @param {Object.<string, any>} changes The document being inserted or the changes being updated
 * @param {boolean} isInsert True if this is an insert operation, false otherwise
 */
function resolveAllFieldValuesForUpdateOrInsert(
  isSuperAdmin,
  schemaSlug,
  changes,
  isInsert
) {
  deleteAllUnnecessaryFields(schemaSlug, changes)
  if (!isSuperAdmin) deleteAllLockedFields(schemaSlug, changes)
  if (isInsert) resolveDefaultValuesForInsert(schemaSlug, changes)
  compiledSchemas[schemaSlug].clean(changes)
}

/**
 * Validates the given document against the given schema
 * @param {boolean} isSuperAdmin Whether the user performing the operation is a super admin
 * @param {string} schemaSlug What is the slug of the schema/collection being inserted into or updated?
 * @param {boolean} isInsert Only if updating document
 * @param {Object.<string, any>} changes The document being inserted or the changes being updated (THIS IS ALSO EDITED AS NECESSARY)
 * @return {string[]} The errors if
 */
export function performAllDocumentValidations(
  isSuperAdmin,
  schemaSlug,
  changes,
  isInsert
) {
  resolveAllFieldValuesForUpdateOrInsert(isSuperAdmin, schemaSlug, changes, isInsert)
  const testDoc = !isInsert ? { $set: changes } : changes

  return validateDocumentAgainstSchema(schemaSlug, testDoc, { modifier: !isInsert })
}

/**
 * Deletes the schema from compileData and
 * @param {string} schemaSlug
 * @return {{extends: string, _id: string}[]} Objects containing the id and the new extends parameter
 */
export function deleteSchema(schemaSlug) {
  /**
   * Making the of the deleting schema the parent each child
   * TODO: Change to implement multiple inheritance
   */
  const parentSlug = compileData[schemaSlug].schema.extends
  /**
   * @type {SchemaDocument[]}
   */
  const newSources = []
  compileData[schemaSlug].children.forEach((childSlug) => {
    compileData[childSlug].schema.extends = parentSlug
    newSources.push(compileData[childSlug].schema)
    compileData[childSlug].parents.delete(schemaSlug)
  })
  compileData[schemaSlug].parents.forEach((parentSlug) => {
    compileData[parentSlug].children.delete(schemaSlug)
  })
  delete compiledSchemas[schemaSlug]
  delete compileData[schemaSlug]
  compileEditedSchemaDocs(newSources)
  return newSources.map((doc) => ({ extends: doc.extends, _id: doc._id }))
}

/**
 * Finds all the descendants of the schema with the given slug
 * @param {string} schemaSlug
 */
export function findAllDescendants(schemaSlug) {
  const descendants = new Set([schemaSlug])
  const checkFrontier = [schemaSlug]
  let slug
  while ((slug = checkFrontier.pop())) {
    compileData[slug].children.forEach((child) => {
      if (!descendants.has(child)) {
        checkFrontier.push(child)
        descendants.add(child)
      }
    })
  }
  return setToArray(descendants)
}

/**
 * Converts sets to arrays
 * @param {Set<string>} set
 */
function setToArray(set) {
  const array = []
  set.forEach((desc) => array.push(desc))
  return array
}

/**
 * Finds all the antecedents(ancestors) of the schema with the given slug
 * @param {string} schemaSlug
 * @return {string[]}
 */
export function findAllAntecedents(schemaSlug) {
  const antecedents = new Set([schemaSlug])
  const checkFrontier = [schemaSlug]
  let slug
  while ((slug = checkFrontier.pop())) {
    compileData[slug].parents.forEach((parent) => {
      if (!antecedents.has(parent)) {
        checkFrontier.push(parent)
        antecedents.add(parent)
      }
    })
  }
  return setToArray(antecedents)
}

/**
 * Finds all the fields of the given schema(including those extended) and returns them
 * @param {string} schemaSlug
 * @returns
 */
export function getAllFieldsOfSchema(schemaSlug) {
  /**
   * @type {SchemaDocumentField[]}
   */
  const fields = []
  findAllAntecedents(schemaSlug).forEach((antecedent) => {
    const antecedentFields = compileData[antecedent].schema.fields
    if (antecedentFields) antecedentFields.forEach((field) => fields.push(field))
  })
  return fields
}
