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
  
  "name": String,
  "location": OptionalString,
  "description": OptionalString,
  "active": {
    "type": Boolean,
    "defaultValue": true
  }
,
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
    columns: [{ field: 'name', title: 'name', editor: true , formatter: null},
  { field: 'location', title: 'location', editor: true , formatter: null},
  { field: 'description', title: 'description', editor: true , formatter: null},
  { field: 'active', title: 'active', editor: true , formatter: null}],
  },
  add: {
    defaultObject: {
  "name": "Untitled",
  "description": "Description",
  "code": "XXX"
},
  },
}
