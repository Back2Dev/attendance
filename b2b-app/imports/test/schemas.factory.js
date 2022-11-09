// import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
// import { Random } from 'meteor/random'
// import CONSTANTS from '/imports/api/constants'
import Schemas from '/imports/api/schemas/schema'

const debug = require('debug')('app:schemas-test')

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

// Sample schemas are in JSON, as per how they are stored in the DB
const assetSamples = [
  {
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
  {
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
  {
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
      {
        optional: false,
        colName: 'rego',
        label: 'Registration No',
        type: 'string',
      },
    ],
  },
  {
    name: 'Bus',
    slug: 'bus',
    active: true,
    extends: 'vehicle',
    fields: [
      {
        optional: true,
        colName: 'seats',
        label: 'Seats',
        type: 'integer',
      },
    ],
  },
  {
    name: 'Car',
    slug: 'car',
    active: true,
    extends: 'vehicle',
    fields: [
      {
        optional: true,
        colName: 'bodyType',
        label: 'Type',
        allowedValues: ['sedan', 'wagon', 'coupe', 'convertible', 'suv'],
        type: 'string',
      },
    ],
  },
  {
    name: 'Asset',
    slug: 'asset',
    active: true,
    extends: 'core',
  },
]

// Factory.define('schema.core', Schemas, new SimpleSchema(samples.core))
Factory.define('schemas', Schemas, {})

const buildSchemas = (schemaList) => {
  return schemaList.map((schema) => {
    return Factory.create('schemas', schema)
  })
}

export const assetSchemas = () => buildSchemas(assetSamples)
