import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  // RegExId,
  // OptionalString,
  // OptionalBlackbox,
  // OptionalInteger,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants.js'

import EventRepeatField from '/imports/ui/components/forms/event-repeat'
import DateTimeField from '/imports/ui/utils/custom-form-fields/datetimefield'
import LocationsField from '/imports/ui/components/forms/location-selector'

const ToolItemSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
  },
  location: {
    type: String,
    optional: true,
  },
  available: {
    type: Boolean,
    defaultValue: true,
    optional: true,
  },
})

const RepeatSchema = new SimpleSchema({
  factor: {
    type: String,
    allowedValues: ['day', 'week', 'month', 'year'],
    optional: true,
  },
  every: {
    type: Number,
    optional: true,
  },
  dow: {
    type: Array,
    optional: true,
  },
  'dow.$': {
    type: Number,
    allowedValues: [0, 1, 2, 3, 4, 5, 6],
    optional: true,
  },
  dom: {
    type: Number,
    optional: true,
  },
  until: {
    type: Date,
    optional: true,
  },
  ref: {
    type: String,
    optional: true,
  },
})

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
  courseId: { ...OptionalRegExId, label: 'Course', uniforms: LocationsField },
  backupCourseId: { ...OptionalRegExId, label: 'Backup Course', uniforms: LocationsField },
  location: {
    type: String,
    label: 'Location',
    optional: true,
  },
  when: {
    type: Date,
    optional: true,
    uniforms: DateTimeField,
  },
  public: {
    type: Boolean,
    defaultValue: false,
    optional: true,
    label: 'Public (visible without login)',
    uniforms: { appearance: 'toggle' },
  },
  repeat: {
    type: RepeatSchema,
    optional: true,
    uniforms: EventRepeatField,
  },
  status: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.EVENT_STATUS),
    defaultValue: 'active',
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
  edit: { schema: new SimpleSchema2Bridge({ schema: editSchema }) },
  list: {
    columns: [
      { field: 'name', title: 'name', editor: true, formatter: null },
      { field: 'tools', title: 'tools', editor: true, formatter: null },
      { field: 'description', title: 'description', editor: true, formatter: null },
      { field: 'type', title: 'type', editor: true, formatter: null },
      { field: 'days', title: 'days', editor: true, formatter: null },
      { field: 'location', title: 'location', editor: true, formatter: null },
      { field: 'when', title: 'when', editor: false, formatter: (cell) => {
        const v = cell.getValue()
        if (!v) return ''
        const d = v instanceof Date ? v : new Date(v)
        return isNaN(d) ? String(v) : d.toLocaleString()
      }},
      { field: 'active', title: 'active', editor: true, formatter: null },
      { field: 'duration', title: 'duration', editor: true, formatter: null },
      { field: 'price', title: 'price', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {
      name: 'Untitled',
      description: [],
      location: 'Location',
      type: 'day',
      status: 'active',
      duration: 0,
      price: 0,
    },
  },
}

export default config
