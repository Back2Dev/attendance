import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/utils/schema-util'
import { LongTextField, SubmitField } from 'uniforms-material'

const editSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  slug: String,
  source: {
    type: String,
    uniforms: {
      component: LongTextField,
    },
  },
  revision: {
    type: SimpleSchema.Integer,
  },
  active: {
    type: Boolean,
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
      { field: 'slug', title: 'slug', editor: true, formatter: null },
      { field: 'source', title: 'source', editor: true, formatter: null },
      { field: 'survey', title: 'survey', editor: true, formatter: null },
      { field: 'revision', title: 'revision', editor: true, formatter: null },
      { field: 'active', title: 'active', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {
      slug: 'untitled-1',
      name: 'Untitled',
      source: 'Q Personal details\n+type=text\nA Name\n A email\n+type=email',
      active: false,
    },
  },
}
