import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Stack, Typography } from '@mui/material'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import './styles.css'
const debug = require('debug')('b2b:reminders')

const CartList = ({ carts, columns, remove, reconcile }) => {
  const [rows, setRows] = React.useState(carts)
  const [rowsSelected, setRowsSelected] = React.useState([])
  const apiRef = useGridApiRef()

  React.useEffect(() => {
    setRows(carts)
    setRowsSelected([])
  }, [carts])

  const deleteRows = () => {
    if (rowsSelected.length === 0)
      alert('Please select one or more items to delete')
    else {
      setRowsSelected((ids) => {
        ids.forEach((id) => remove(id))
        return []
      })
      // if (tableRef) tableRef.current.table.deselectRow()
    }
  }
  const reconcileRows = () => {
    if (rowsSelected.length === 0)
      alert('Please select one or more items to reconcile')
    else {
      debug('reconciling', rowsSelected)
      setRowsSelected((ids) => {
        ids.forEach((id) => reconcile(id))
        return []
      })
    }
  }
  const downloadCSV = () => {
    apiRef.current.exportDataAsCsv()
  }

  const buttons = [
    {
      action: reconcileRows,
      id: 'reconcile',
      caption: 'Reconcile',
      color: 'green',
    },
    {
      action: deleteRows,
      id: 'delete',
      caption: 'Delete',
      color: 'red',
    },
    {
      action: downloadCSV,
      id: 'export',
      caption: 'Save as CSV',
      color: 'blue',
    },
  ]

  return (
    <>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Shopping carts</Typography>
        <Stack direction="row" spacing={1}>
          {buttons.map((btn) => (
            <Button
              id={btn.id}
              key={btn.id}
              size="small"
              onClick={btn.action}
              color={btn.color}
              variant="contained"
              type="button"
            >
              {btn.caption}
            </Button>
          ))}
        </Stack>
      </Box>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        checkboxSelection
        rowSelectionModel={rowsSelected}
        onRowSelectionModelChange={(model) => setRowsSelected(model)}
        disableRowSelectionOnClick
        autoHeight
      />
    </>
  )
}

CartList.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  reconcile: PropTypes.func.isRequired,
  purchases: PropTypes.array.isRequired,
}

export default CartList
