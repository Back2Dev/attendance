import React, { useContext } from 'react'
import styled from 'styled-components'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Button,
} from '@material-ui/core'
import Draggable from 'react-draggable'

import { CalendarContext } from './contexts'

const StyledEventForm = styled.div``

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

function EventForm() {
  const { formOpen, setFormOpen, selectedDate } = useContext(CalendarContext)

  const handleClose = () => {
    setFormOpen(false)
  }

  console.log(PaperComponent)

  return (
    <StyledEventForm>
      <Dialog
        open={formOpen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Create event
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{selectedDate?.toString()}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </StyledEventForm>
  )
}

export default EventForm
