import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { AutoForm, AutoFields } from 'uniforms-material'
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
  .form-actions {
    justify-content: space-around;
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
  const {
    formOpen,
    setFormOpen,
    selectedDate,
    selectedEvent,
    selectEvent,
    storeEvent,
  } = useContext(CalendarContext)

  const formRef = useRef()

  const [data, setData] = useState({
    when: selectedDate,
    active: true,
  })

  useEffect(() => {
    if (selectedEvent) {
      setData(selectedEvent)
      return
    }
    if (selectedDate) {
      setData({ ...data, when: selectedDate })
      return
    }
    setData({
      active: true,
    })
  }, [selectedDate, selectedEvent])

  const handleClose = () => {
    setFormOpen(false)
    selectEvent(null)
  }

  const handleSubmit = (model) => {
    console.log('handle submit', JSON.stringify(model, null, 2))
    storeEvent(model, (result) => {
      if (result?.status === 'success') {
        handleClose()
      }
    })
  }

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
        {data._id ? 'Edit event' : 'Create event'}
      </DialogTitle>
      <DialogContent className="form-content">
        <AutoForm
          schema={schemaBridge}
          model={data}
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <AutoFields autoField={CustomAutoField} />
        </AutoForm>
      </DialogContent>
      <DialogActions className="form-actions">
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            formRef.current?.submit()
          }}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </StyledEventForm>
  )
}

export default EventForm
