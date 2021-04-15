import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
} from '/imports/api/utils/schema-util'

const editSchema = new SimpleSchema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  description: {
    type: String,
  },
  notifications: {
    type: Array,
  },
  'notifications.$': {
    type: 'StepsNotificationSchema',
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
      { field: 'description', title: 'Description', editor: true, formatter: null },
      // { field: 'notifications', title: 'notifications', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {
      name: 'Untitled',
      slug: 'untitled',
      notifications: [],
    },
  },
}
