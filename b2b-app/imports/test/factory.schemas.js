// import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
// import { Random } from 'meteor/random'
// import CONSTANTS from '/imports/api/constants'
import Schemas from '/imports/api/schemas/schema'
import SimpleSchema from 'simpl-schema'

/**
 * @typedef {{
        name: string;
        slug: string;
        active: boolean;
        extends: string;
        fields: {
            optional: boolean;
            colName: string;
            label: string;
            type: string;
        }[];
    }} SchemaData
 */

const ALLOWED_TYPES = {
  string: String,
  boolean: Boolean,
  integer: SimpleSchema.Integer,
  array: Array,
  object: Object,
  date: Date,
}

// Sample schemas are in JSON, as per how they are stored in the DB
const samples = {
  core: {
    name: 'Core',
    slug: 'core',
    active: true,
    fields: [
      {
        optional: false,
        colName: 'createdAt',
        label: 'Created',
        type: 'date',
      },
      {
        optional: false,
        colName: 'updatedAt',
        label: 'Updated',
        type: 'date',
      },
    ],
  },
  tool: {
    name: 'Hand tool',
    slug: 'tool',
    extends: 'asset',
    active: true,
    fields: [
      {
        optional: false,
        colName: 'toolName',
        label: 'Tool Name',
        type: 'string',
      },
    ],
  },
  vehicle: {
    name: 'Motor Vehicle',
    slug: 'vehicle',
    active: true,
    extends: 'asset',
    fields: [
      {
        optional: false,
        colName: 'model',
        label: 'Model',
        type: 'string',
      },
    ],
  },
  bus: {
    name: 'Bus',
    slug: 'bus',
    active: true,
    extends: 'vehicle',
    fields: [
      {
        optional: true,
        colName: 'purpose',
        label: 'Purpose',
        type: 'string',
      },
    ],
  },
  asset: {
    name: 'Asset',
    slug: 'asset',
    active: true,
    extends: 'core',
  },
}

/**
 * @param {SchemaData[]} schemasList
 */
function compileSchemas(schemasList) {
  /**
   * @type {Object.<string, {schema: SchemaData, children: string[]}>}
   */
  const compileData = {}

  schemasList.forEach((schema) => {
    // Compile all data types
    schema.fields.forEach((field) => {
      if (ALLOWED_TYPES[field.type]) field.type = ALLOWED_TYPES[field.type]
    })
    compileData[schema.slug] = {
      schema,
      children: [],
    }

    compileData[schema.extends].children.push(schema.slug)
  })

  const compileFrontier = [compileData['core']]
  const compiledSchemas = {}
  let schemaData
  while ((schemaData = compileFrontier.pop())) {
    let schema = schemaData.schema
    let compiledSchema = new SimpleSchema(schemaData.schema)

    if (schema.extends)
      compiledSchema = compiledSchema.extend(compiledSchemas[schema.extends])

    Factory.define(`schema.${schema.slug}`, Schemas, compiledSchema)
    compiledSchemas[schema.slug] = compiledSchema
    schemaData.children.forEach((child) => {
      compileFrontier.push(compileData[child])
    })
  }
  return compiledSchemas
}

compileSchemas(Object.values(samples))

// Factory.define('schema.core', Schemas, new SimpleSchema(samples.core))
