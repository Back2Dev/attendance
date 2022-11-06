import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { OptionalString } from '/imports/api/utils/schema-util'

// const dateFormat = {
//   inputFormat: 'DD/MM/YY hh:mm',
//   outputFormat: 'DD/MM/YY h:mm A',
//   invalidPlaceholder: '',
// }

const editSchema = new SimpleSchema({
  name: String,
  revision: {
    type: SimpleSchema.Integer,
    defaultValue: '1',
  },
  description: OptionalString,
  active: {
    type: Boolean,
    defaultValue: true,
  },
  source: OptionalString,
})

const addSchema = new SimpleSchema({
  name: String,
  revision: {
    type: SimpleSchema.Integer,
    defaultValue: '1',
  },
  description: OptionalString,
  active: {
    type: Boolean,
    defaultValue: true,
  },
  source: OptionalString,
})

//
// Configuration to control display of individual records in a table
//
const config = {
  view: {
    header: true, // Displays a heading row
    rows: [
      // Array of field names and display labels
      { field: 'name', label: 'Name' },
    ],
  },
  edit: { schema: new SimpleSchema2Bridge(editSchema) },
  add: {
    schema: new SimpleSchema2Bridge(addSchema),
    defaultObject: {
      name: 'Untitled',
      description: 'Description',
      revision: '1',
      active: true,
    },
  },
  list: {
    columns: [
      { field: 'name', title: 'name', editor: true, formatter: null },
      { field: 'revision', title: 'revision', editor: true, formatter: null },
      { field: 'description', title: 'description', editor: true, formatter: null },
      { field: 'active', title: 'active', editor: true, formatter: null },
      { field: 'source', title: 'source', editor: true, formatter: null },
    ],
  },
  browse: {
    columns: [
      { field: 'name', title: 'name', formatter: null },
      { field: '_id', title: '', formatter: null, headerSort: false },
    ],
  },
}

export default config
