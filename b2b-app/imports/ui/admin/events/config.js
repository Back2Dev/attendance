import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  // RegExId,
  // OptionalString,
  // OptionalBlackbox,
  // OptionalInteger,
} from '/imports/api/utils/schema-util'

import { ToolItemSchema, RepeatSchema } from '/imports/api/events/schema.js'

// const dateFormat = {
//   inputFormat: 'DD/MM/YY hh:mm',
//   outputFormat: 'DD/MM/YY h:mm A',
//   invalidPlaceholder: '',
// }

const editSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Event name',
  },
  tools: {
    type: Array,
    optional: true,
  },
  'tools.$': ToolItemSchema,
  description: {
    type: Array,
    optional: true,
  },
  'description.$': String,
  courseId: OptionalRegExId,
  backupCourseId: OptionalRegExId,
  location: {
    type: String,
    label: 'Location',
    optional: true,
  },
  when: {
    type: Date,
    optional: true,
  },
  repeat: {
    type: RepeatSchema,
    optional: true,
  },
  active: {
    type: Boolean,
  },
  duration: {
    type: SimpleSchema.Integer,
    label: 'Event duration (hours)',
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Event Price in cents',
    defaultValue: 0,
  },
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
  list: {
    columns: [
      { field: 'name', title: 'name', editor: true, formatter: null },
      { field: 'tools', title: 'tools', editor: true, formatter: null },
      { field: 'description', title: 'description', editor: true, formatter: null },
      { field: 'type', title: 'type', editor: true, formatter: null },
      { field: 'days', title: 'days', editor: true, formatter: null },
      { field: 'location', title: 'location', editor: true, formatter: null },
      { field: 'when', title: 'when', editor: true, formatter: null },
      { field: 'active', title: 'active', editor: true, formatter: null },
      { field: 'duration', title: 'duration', editor: true, formatter: null },
      { field: 'price', title: 'price', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {
      name: 'Untitled',
      description: 'Description',
      location: 'Location',
      type: 'day',
      active: false,
      duration: 0,
      price: 0,
    },
  },
}

export default config
