import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Button,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Draggable from 'react-draggable'
import { AutoForm, AutoFields } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'
import { useConfirm } from '/imports/ui/components/commons/confirm-box.js'

import { CalendarContext } from './contexts'
import config from '/imports/ui/admin/events/config.js'

const schemaBridge = config.edit.schema

const StyledEventForm = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .form-title {
    background-color: #0000001c;
    padding: 0 10px;
    display: flex;
    .MuiTypography-root {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
    .form-title-text {
      display: flex;
      align-items: center;
    }
    button {
    }
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
    deleteEvent,
  } = useContext(CalendarContext)

  const formRef = useRef()

  const [data, setData] = useState({
    when: selectedDate,
    active: true,
  })
  const [recurringUpdateOpen, setRecurringUpdateOpen] = useState(false)
  const [recurringEditOpt, setRecurringEditOpt] = useState('')

  useEffect(() => {
    if (selectedEvent) {
      setData(selectedEvent)
      return
    }
    if (selectedDate) {
      setData({ when: selectedDate, active: true })
      return
    }
    setData({
      active: true,
    })
  }, [selectedDate, selectedEvent])

  const { showConfirm } = useConfirm()

  const handleClose = () => {
    setFormOpen(false)
    selectEvent(null)
  }

  const handleDelete = () => {
    console.log('delete')
    if (!data.repeat?.factor) {
      showConfirm({
        onConfirm: () => {
          deleteEvent({
            id: data._id,
            cb: (result) => {
              if (result?.status === 'success') {
                handleClose()
              }
            },
          })
        },
        title: 'Deleting event',
        message: 'Are you sure?',
      })
    } else {
      console.log('handle deleting recurring event')
    }
  }

  // store the form model
  const formModel = useRef(null)

  const handleRecurringUpdate = () => {
    setRecurringUpdateOpen(false)
    storeEvent({
      data: formModel.current,
      cb: (result) => {
        if (result?.status === 'success') {
          handleClose()
        }
        setRecurringEditOpt('')
      },
      recurring: recurringEditOpt,
    })
  }

  const handleSubmit = (model) => {
    console.log('handle submit', JSON.stringify(model, null, 2))
    formModel.current = model

    // check if this is existing event and repeating enabled
    if (model._id && model.repeat?.factor) {
      setRecurringUpdateOpen(true)
    } else {
      storeEvent({
        data: model,
        cb: (result) => {
          if (result?.status === 'success') {
            handleClose()
          }
        },
      })
    }
  }

  return (
    <div>
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
          <div className="form-title-text">
            {data._id ? 'Edit event' : 'Create event'}
          </div>
          {data._id && (
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          )}
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
      <Dialog
        open={recurringUpdateOpen}
        onClose={() => setRecurringUpdateOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Edit recurring event</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <RadioGroup
              aria-label="recurring-opt"
              value={recurringEditOpt}
              onChange={(e) => setRecurringEditOpt(e.target.value)}
            >
              <FormControlLabel value="this" control={<Radio />} label="This event" />
              <FormControlLabel
                value="furture"
                control={<Radio />}
                label="This and following events"
              />
              <FormControlLabel value="all" control={<Radio />} label="All events" />
            </RadioGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleRecurringUpdate}
            color="primary"
            autoFocus
            disabled={!recurringEditOpt}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EventForm
