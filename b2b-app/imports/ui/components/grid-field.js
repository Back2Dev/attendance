import React from 'react'
import { DataGrid } from '@material-ui/data-grid'

const GridField = ({ data }) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} hideFooter={true} />
    </div>
  )
}

export default GridField
