import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Button,
} from '@material-ui/core'
import Draggable from 'react-draggable'
import { AutoForm } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'

import { CalendarContext } from './contexts'
import config from '/imports/ui/admin/events/config.js'

const schemaBridge = config.edit.schema

const StyledEventForm = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .form-title {
    background-color: #0000001c;
    padding: 10px;
  }
  .form-content {
    padding: 10px;
  }
`

function PaperComponent(props) {
  return (
    <Draggable handle=".draggable" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

function EventForm() {
  const { formOpen, setFormOpen, selectedDate } = useContext(CalendarContext)

  const [data, setData] = useState({
    when: selectedDate,
  })
  useEffect(() => {
    setData({ ...data, when: selectedDate })
  }, [selectedDate])

  const handleClose = () => {
    setFormOpen(false)
  }

  const handleSubmit = () => {}

  return (
    <StyledEventForm
      open={formOpen}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-cal-form-title"
    >
      <DialogTitle
        style={{ cursor: 'move' }}
        id="draggable-cal-form-title"
        className="draggable form-title"
      >
        Create event
      </DialogTitle>
      <DialogContent className="form-content">
        <AutoForm
          schema={schemaBridge}
          model={data}
          onSubmit={handleSubmit}
          autoField={CustomAutoField}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Submit
        </Button>
      </DialogActions>
    </StyledEventForm>
  )
}

export default EventForm
