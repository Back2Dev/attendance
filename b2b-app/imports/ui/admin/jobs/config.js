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
  
  "_id": OptionalRegExId,
  "name": {
    "type": String,
    "optional": true,
    "label": "Customer name"
  },
  "phone": {
    "type": String,
    "optional": true,
    "label": "Customer phone number"
  },
  "email": {
    "type": String,
    "optional": true,
    "label": "Customer email"
  },
  "isRefurbish": {
    "type": Boolean,
    "label": "Is a refurbishment"
  },
  "make": {
    "type": String,
    "label": "Bike make"
  },
  "model": {
    "type": String,
    "optional": true,
    "label": "Bike model"
  },
  "color": {
    "type": String,
    "label": "Bike color"
  },
  "bikeValue": {
    "type": SimpleSchema.Integer,
    "label": "Estimated bike value in cents"
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
  { field: 'phone', title: 'phone', editor: true , formatter: null},
  { field: 'email', title: 'email', editor: true , formatter: null},
  { field: 'isRefurbish', title: 'isRefurbish', editor: true , formatter: null},
  { field: 'make', title: 'make', editor: true , formatter: null},
  { field: 'model', title: 'model', editor: true , formatter: null},
  { field: 'color', title: 'color', editor: true , formatter: null},
  { field: 'bikeValue', title: 'bikeValue', editor: true , formatter: null}],
  },
  add: {
    defaultObject: {},
  },
}
