import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/utils/schema-util'
import SlateDisplay from '/imports/ui/components/forms/slate-field'

const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const MapSchema = new SimpleSchema({
  title: String,
  imageUrl: String,
})

const editSchema = new SimpleSchema({
  slug: String,
  title: String,
  slug: String,
  map: {
    type: Array,
    optional: true,
  },
  'map.$': MapSchema,
  description: { type: Array },
  'description.$': String,
  difficulty: {
    type: String,
    allowedValues: ['beginner', 'intermediate', 'advanced'],
    defaultValue: 'beginner',
  },
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
      { field: 'title', label: 'Name' },
      { field: 'slug', label: 'Slug' },
      { field: 'description', label: 'Description', component: SlateDisplay },
    ],
  },
  edit: { schema: new SimpleSchema2Bridge(editSchema) },
  list: {
    columns: [
      { field: 'title', title: 'title', editor: true, formatter: null },
      { field: 'slug', title: 'slug', editor: true, formatter: null },
      { field: 'map', title: 'map', editor: true, formatter: null },
      { field: 'description', title: 'description', editor: true, formatter: null },
      { field: 'difficulty', title: 'difficulty', editor: true, formatter: null },
      { field: 'active', title: 'active', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {
      name: 'Untitled',
      description: [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
        {
          type: 'image',
          url: 'https://source.unsplash.com/kFrdX5IeQzI',
          children: [{ text: '' }],
        },
      ],
      code: 'XXX',
    },
  },
}
