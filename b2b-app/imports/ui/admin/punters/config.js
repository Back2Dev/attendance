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
  
  "memberNo": String,
  "name": String,
  "directDebit": OptionalString,
  "guestCard": OptionalString,
  "pre79Card": OptionalString,
  "carPass": OptionalString,
  "subscription": OptionalString,
  "payByInstalments": OptionalString,
  "item1": OptionalString,
  "item1Pmt": OptionalString,
  "item2": OptionalString,
  "item2Pmt": OptionalString,
  "item3": OptionalString,
  "item3Pmt": OptionalString,
  "item4": OptionalString,
  "item4Pmt": OptionalString,
  "item5": OptionalString,
  "item5Pmt": OptionalString,
  "firstName": OptionalString,
  "lastName": OptionalString,
  "status": OptionalString,
  "statusReason": OptionalString
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
    columns: [{ field: 'memberNo', title: 'memberNo', editor: true , formatter: null},
  { field: 'name', title: 'name', editor: true , formatter: null},
  { field: 'directDebit', title: 'directDebit', editor: true , formatter: null},
  { field: 'guestCard', title: 'guestCard', editor: true , formatter: null},
  { field: 'pre79Card', title: 'pre79Card', editor: true , formatter: null},
  { field: 'carPass', title: 'carPass', editor: true , formatter: null},
  { field: 'subscription', title: 'subscription', editor: true , formatter: null},
  { field: 'payByInstalments', title: 'payByInstalments', editor: true , formatter: null},
  { field: 'item1', title: 'item1', editor: true , formatter: null},
  { field: 'item1Pmt', title: 'item1Pmt', editor: true , formatter: null},
  { field: 'item2', title: 'item2', editor: true , formatter: null},
  { field: 'item2Pmt', title: 'item2Pmt', editor: true , formatter: null},
  { field: 'item3', title: 'item3', editor: true , formatter: null},
  { field: 'item3Pmt', title: 'item3Pmt', editor: true , formatter: null},
  { field: 'item4', title: 'item4', editor: true , formatter: null},
  { field: 'item4Pmt', title: 'item4Pmt', editor: true , formatter: null},
  { field: 'item5', title: 'item5', editor: true , formatter: null},
  { field: 'item5Pmt', title: 'item5Pmt', editor: true , formatter: null},
  { field: 'firstName', title: 'firstName', editor: true , formatter: null},
  { field: 'lastName', title: 'lastName', editor: true , formatter: null},
  { field: 'status', title: 'status', editor: true , formatter: null},
  { field: 'statusReason', title: 'statusReason', editor: true , formatter: null}],
  },
  add: {
    defaultObject: {
  "name": "Untitled",
  "description": "Description",
  "code": "XXX"
},
  },
}
