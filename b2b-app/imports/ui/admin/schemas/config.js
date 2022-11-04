import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { FieldsSchema } from '/imports/api/schemas/schema'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  Blackbox,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/utils/schema-util'

const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const editSchema = new SimpleSchema({
  name: String,
  slug: String,
  extends: OptionalString,
  fields: {
    type: Array,
    optional: true,
  },
  'fields.$': FieldsSchema,
  active: {
    type: Boolean,
    defaultValue: true,
  },
})

//
// Configuration to control display of individual records in a table
//
export default config = {
  view: {
    header: true, // Displays a heading row
    rows: [
      // Array of field names and display labels
      { field: 'name', label: 'Name' },
    ],
  },
  edit: { schema: new SimpleSchema2Bridge(editSchema) },
  list: {
    columns: [
      { field: 'name', title: 'name', editor: true, formatter: null },
      { field: 'fields', title: 'fields', editor: true, formatter: null },
      { field: 'active', title: 'active', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {
      name: 'Untitled',
      slug: 'untitled',
      extends: 'core',
    },
  },
}
