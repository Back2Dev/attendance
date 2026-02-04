import React from 'react'
import PropTypes from 'prop-types'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const List = ({ items, members, events, update, remove, add, columns, loading }) => {
  const [rowsSelected, setRowsSelected] = React.useState([])
  const [sessionDate, setSessionDate] = React.useState(Session.get('filterDate'))
  const [modalOpen, setModalOpen] = React.useState(false)
  const [newSession, setNewSession] = React.useState({})

  React.useEffect(() => {
    setRowsSelected([])
  }, [items])

  const processRowUpdate = async (newRow) => {
    await update(newRow)
    return newRow
  }

  const pickDate = (date) => {
    setSessionDate(date)
    Session.set('filterDate', date)
  }

  const inputMember = (_, option) => {
    if (!option) return
    setNewSession((prev) => ({
      ...prev,
      memberId: option.value,
      memberName: option.label
    }))
  }

  const inputEvent = (_, option) => {
    if (!option) return
    const selectedEvent = events.find((event) => event._id === option.value)
    if (!selectedEvent) return
    setNewSession((prev) => ({
      ...prev,
      name: selectedEvent.name,
      duration: selectedEvent.duration,
      price: selectedEvent.price,
      timeOut: moment(sessionDate).add(selectedEvent.duration, 'hours').toDate()
    }))
  }

  const addANewRow = () => {
    add({ ...newSession, timeIn: sessionDate })
    setModalOpen(false)
  }

  const deleteRows = () => {
    rowsSelected.forEach((id) => remove(id))
  }

  if (loading) return <Typography>Loading...</Typography>
  if (!items.length) return <Typography>No data found</Typography>

  const memberOptions = members
    .map((member) => ({
      label: member.name,
      value: member._id,
      avatar: member.avatar
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const eventOptions = events
    .map((event) => ({
      label: event.name,
      value: event._id
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <Box>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Sessions list</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <DatePicker selected={sessionDate} dateFormat="dd/MM/yyyy h:mm aa" onChange={pickDate} showTimeSelect />
          <Button size="small" onClick={deleteRows} color="error" variant="contained" type="button">
            Delete
          </Button>
          <Button size="small" color="inherit" variant="contained" onClick={() => setModalOpen(true)}>
            Add
          </Button>
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Add an attendee</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Autocomplete
                  options={memberOptions}
                  onChange={inputMember}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box
                        component="img"
                        src={`/images/avatars/${option.avatar}`}
                        alt={option.label}
                        sx={{ width: 24, height: 24, borderRadius: '50%', mr: 1 }}
                      />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Member Name" placeholder="Select Member" />}
                />
                <Autocomplete
                  options={eventOptions}
                  onChange={inputEvent}
                  renderInput={(params) => <TextField {...params} label="Session Name" placeholder="Select Session" />}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button onClick={addANewRow} variant="contained" color="success">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Box>
      <DataGrid
        rows={items.sort((a, b) => b.createdAt - a.createdAt)}
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
  members: PropTypes.array,
  events: PropTypes.array,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}

export default List
