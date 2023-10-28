import React from 'react'
import { DataGrid } from '@material-ui/data-grid'
import { connectField } from 'uniforms'

const GridField = ({ rows, columns, onChange }) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        onCellEditCommit={({ id, field, value: text }) =>
          onChange(JSON.stringify({ [id]: { field, value: text } }))
        }
        rows={rows}
        columns={[{ field: 'name', editable: false, width: 200 }, ...columns]}
        hideFooter={true}
      />
    </div>
  )
}

export default connectField(GridField)
