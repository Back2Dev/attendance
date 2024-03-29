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
import moment from 'moment'

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
    timeZoneOffset,
  } = useContext(CalendarContext)

  console.log('timeZoneOffset', timeZoneOffset)

  const formRef = useRef()

  const [data, setData] = useState({
    when: selectedDate,
  })
  const [recurringUpdateOpen, setRecurringUpdateOpen] = useState(false)
  const [recurringAction, setRecurringAction] = useState('')
  const [recurringEditOpt, setRecurringEditOpt] = useState('')

  useEffect(() => {
    if (selectedEvent) {
      setData(selectedEvent)
      return
    }
    if (selectedDate) {
      setData({ when: selectedDate, status: 'active' })
      return
    }
    setData({
      status: 'active',
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
      setRecurringAction('delete')
      setRecurringUpdateOpen(true)
    }
  }

  // store the form model
  const formModel = useRef(null)

  const handleRecurringAction = () => {
    setRecurringUpdateOpen(false)
    if (recurringAction === 'edit') {
      storeEvent({
        // data: formModel.current,
        data: {
          ...formModel.current,
          // we change it back to the right date time before storing
          when: moment(formModel.current.when).add(timeZoneOffset, 'minutes').toDate(),
        },
        cb: (result) => {
          if (result?.status === 'success') {
            handleClose()
          }
          setRecurringEditOpt('')
        },
        recurring: recurringEditOpt,
      })
    }
    if (recurringAction === 'delete') {
      console.log('delete', recurringEditOpt)
      deleteEvent({
        id: data._id,
        cb: (result) => {
          if (result?.status === 'success') {
            handleClose()
          }
          setRecurringEditOpt('')
        },
        recurring: recurringEditOpt,
      })
    }
  }

  const handleSubmit = (model) => {
    console.log('handle submit', JSON.stringify(model, null, 2))
    formModel.current = model

    // check if this is existing event and repeating enabled
    if (model._id && model.repeat?.factor) {
      setRecurringAction('edit')
      setRecurringUpdateOpen(true)
    } else {
      storeEvent({
        data: {
          ...model,
          // we change it back to the right date time before storing
          when: moment(model.when).add(timeZoneOffset, 'minutes').toDate(),
        },
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
            model={{
              ...data,
              // because the autoFrom date field converts the time to UTC
              // then we have to modify it before give it to date field
              when: moment(data.when).subtract(timeZoneOffset, 'minutes').toDate(),
            }}
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
        <DialogTitle>
          {recurringAction === 'edit' ? 'Edit' : 'Delete'} recurring event
        </DialogTitle>
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
            onClick={handleRecurringAction}
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
