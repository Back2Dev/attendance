import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
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
  
  "yesterday": {
    "type": String,
    "optional": true
  },
  "today": OptionalString,
  "blockers": OptionalString,
  "userId": String,
  "userName": String
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
    columns: [{ field: 'yesterday', title: 'yesterday', editor: true , formatter: null},
  { field: 'today', title: 'today', editor: true , formatter: null},
  { field: 'blockers', title: 'blockers', editor: true , formatter: null},
  { field: 'userName', title: 'userName', editor: true , formatter: null}],
  },
  add: {
    defaultObject: {},
  },
}
