import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Stack, Typography } from '@mui/material'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'

const List = ({ items, update, remove, insert, refresh, columns, defaultObject, loading }) => {
  const [rowsSelected, setRowsSelected] = React.useState([])
  const apiRef = useGridApiRef()

  React.useEffect(() => {
    setRowsSelected([])
  }, [items])

  const processRowUpdate = async (newRow) => {
    await update(newRow)
    return newRow
  }

  const downloadCSV = () => {
    apiRef.current.exportDataAsCsv()
  }

  const refreshRows = () => {
    refresh()
  }

  const deleteRows = () => {
    if (!rowsSelected.length) {
      alert('Please select one or more items to delete')
      return
    }
    rowsSelected.forEach((id) => remove(id))
  }

  const addANewRow = () => {
    insert(defaultObject)
  }

  if (loading) return <Typography>Loading...</Typography>
  if (!items.length) return <Typography>No data found</Typography>

  const buttons = [
    { action: refreshRows, id: 'refresh', caption: 'Refresh', color: 'success' },
    { action: downloadCSV, id: 'csv', caption: 'Download CSV', color: 'inherit' },
    { action: deleteRows, id: 'delete', caption: 'Delete', color: 'error' },
    { action: addANewRow, id: 'add', caption: 'Add', color: 'inherit' }
  ]

  return (
    <Box>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Credit card charges</Typography>
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
        rows={items}
        columns={columns}
        getRowId={(row) => row._id}
        checkboxSelection
        rowSelectionModel={rowsSelected}
        onRowSelectionModelChange={(model) => setRowsSelected(model)}
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(err) => console.error(err)}
        autoHeight
      />
    </Box>
  )
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  insert: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  defaultObject: PropTypes.object.isRequired
}

export default List
