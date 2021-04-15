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
  
  "memberId": RegExId,
  "eventId": RegExId,
  "name": String,
  "memberName": String,
  "status": {
    "type": String,
    "allowedValues": [
      "booked",
      "cancelled",
      "attended",
      "missed"
    ],
    "defaultValue": "booked"
  },
  "toolName": OptionalString,
  "toolId": OptionalRegExId,
  "bookedDate": {
    "type": Date,
    "optional": true
  },
  "bookedAt": {
    "type": Date,
    "optional": true
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
  { field: 'memberName', title: 'memberName', editor: true , formatter: null},
  { field: 'status', title: 'status', editor: true , formatter: null},
  { field: 'toolName', title: 'toolName', editor: true , formatter: null},
  { field: 'bookedDate', title: 'bookedDate', editor: true , formatter: 'datetime', formatterParams: dateFormat},
  { field: 'bookedAt', title: 'bookedAt', editor: true , formatter: null}],
  },
  add: {
    defaultObject: {
  "name": "Untitled",
  "description": "Description",
  "code": "XXX"
},
  },
}
