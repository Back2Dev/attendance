import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  OptionalRegExId,
  RegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalInteger,
} from '/imports/api/utils/schema-util'

const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const editSchema = new SimpleSchema({
  // _id: RegExId,
  name: {
    type: String,
    label: 'Parts description',
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Price',
  },
  code: {
    type: String,
    label: 'Location code F=Front, R=Rear, FR=Front & Rear',
    allowedValues: ['O', 'F', 'R', 'FR'],
  },
  category: {
    type: String,
    label: 'Parts category',
    optional: true,
    allowedValues: [
      'new parts',
      'service',
      'service+parts',
      'used parts',
      'misc',
      'bike sale',
    ],
  },
  // used: {
  //   type: Boolean,
  //   label: 'Is item new or used',
  // },
  tags: {
    type: Array,
    optional: true,
  },
  'tags.$': {
    type: String,
    allowedValues: ['Minor', 'Major'], // for this moment we support only these 2 tags
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
      { field: 'price', title: 'price', editor: true, formatter: null },
      { field: 'code', title: 'code', editor: true, formatter: null },
      { field: 'category', title: 'category', editor: true, formatter: null },
      { field: 'used', title: 'used', editor: true, formatter: null },
      { field: 'tags', title: 'tags', editor: true, formatter: null },
      {
        field: 'createdAt',
        title: 'createdAt',
        editor: true,
        formatter: 'datetime',
        formatterParams: dateFormat,
      },
      {
        field: 'updatedAt',
        title: 'updatedAt',
        editor: true,
        formatter: 'datetime',
        formatterParams: dateFormat,
      },
    ],
  },
  add: {
    defaultObject: {
      tags: [],
    },
  },
}

export default config
