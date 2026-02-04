import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const List = ({ items, update, remove, add, columns, defaultObject, loading }) => {
  const [rowsSelected, setRowsSelected] = React.useState([])

  React.useEffect(() => {
    setRowsSelected([])
  }, [items])

  const processRowUpdate = async (newRow) => {
    await update(newRow)
    return newRow
  }

  const addANewRow = () => {
    add(defaultObject)
  }

  const deleteRows = () => {
    rowsSelected.forEach((id) => remove(id))
  }

  if (loading) return <Typography>Loading...</Typography>
  if (!items.length) return <Typography>No data found</Typography>

  return (
    <Box>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Promos list</Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={deleteRows} color="error" variant="contained" type="button">
            Delete
          </Button>
          <Button size="small" onClick={addANewRow} color="inherit" variant="contained" type="button">
            Add
          </Button>
        </Stack>
      </Box>
      <DataGrid
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
  add: PropTypes.func.isRequired
}

export default List
