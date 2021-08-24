import React from 'react'
import DataGrid, { SelectColumn, TextEditor } from 'react-data-grid'
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

const editSchema = new SimpleSchema({
  name: String,
  slug: String,
  approvalRequired: Boolean,
})

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
      {
        key: 'name',
        name: 'Name',
        editor: TextEditor,
      },
      {
        key: 'slug',
        name: 'Slug',
        width: 200,
        editor: TextEditor,
      },
      {
        key: 'approvalRequired',
        name: 'Approval Required',
        width: 200,
        type: 'boolean',
      },
      {
        key: 'updatedAt',
        name: 'Updated',
        width: 200,
        type: 'date',
      },
    ],
  },

  add: {
    defaultObject: { name: 'Untitled', slug: 'untitled', approvalRequired: true },
  },
}
