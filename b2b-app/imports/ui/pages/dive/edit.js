import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import { Box, Typography } from '@mui/material'
import { AutoForm, AutoFields, ErrorsField, SubmitField } from 'uniforms-mui'
import { CustomAutoField } from '/imports/ui/components/forms'
import CONSTANTS from '/imports/api/constants.js'

import { schemaBridge } from './edit-schema'
import { usePrevious } from '../../utils/use-previous'
import Notifications from './edit-notifications'

const debug = require('debug')('app:triggers-edit')

const TriggerEdit = ({ methods, editing, messageTemplates, autoSave }) => {
  const [notifications, setNotifications] = useState(() => editing?.notifications)

  // ek-568: auto save when a different trigger is selected
  const prevEditing = usePrevious(editing)
  const modifiedData = useRef({})

  useEffect(() => {
    debug('autoSave', autoSave)
    debug('new editing', editing)
    debug('modifiedData', modifiedData.current)

    // switch to other trigger
    if (prevEditing?._id && editing._id && prevEditing._id !== editing._id) {
      // auto save enabled
      if (autoSave && Object.keys(modifiedData.current).length > 0) {
        debug('save', modifiedData.current)
        save({ ...prevEditing, ...modifiedData.current })
        modifiedData.current = {}
      }
    }
  }, [editing, autoSave])

  const saveID = (oldSlug, message) => {
    const mapNotifications = notifications.map((notif) => {
      if (notif.text === oldSlug.current) {
        notif.text = message.text
        return notif
      }
      return notif
    })
    setNotifications(mapNotifications)
  }

  const save = (form) => {
    try {
      // Get notifications from tabulator
      form.notifications = notifications
      methods.update(form)
      // fix double save on the backend issue
      modifiedData.current = {}
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }

  const recipientOptions = Object.keys(CONSTANTS.NOTIFY_ROLES).map((key) => {
    return { text: CONSTANTS.NOTIFY_ROLES[key], value: key }
  })

  if (!editing) {
    return (
      <Box mt={10}>
        <Typography variant="h6">Please select a trigger</Typography>
      </Box>
    )
  }

  return (
    <Box mt={10}>
      <Typography variant="h3">{editing?.name}</Typography>
      <Typography color="primary" variant="h6">
        {editing?.type} (Revision {editing?.revision}: &nbsp;
        {DateTime.fromJSDate(editing?.updatedAt).toFormat('dd/MM/yy HH:mm')}
      </Typography>
      <AutoForm
        schema={schemaBridge}
        model={editing}
        onSubmit={save}
        autoField={CustomAutoField}
        onChange={(key, value) => {
          modifiedData.current = { ...modifiedData.current, [key]: value }
        }}
      >
        <AutoFields />
        <ErrorsField />
        <Box mt={1}>
          <Notifications
            stepId={editing._id}
            rows={editing.notifications}
            onChange={(data) => {
              setNotifications(data)
            }}
            messageTemplates={messageTemplates}
            saveMessage={methods.saveMessage}
            saveID={saveID}
            recipientOptions={recipientOptions}
          />
        </Box>
        <Box mt={1}>
          <SubmitField variant="contained" color="primary">
            Submit
          </SubmitField>
        </Box>
      </AutoForm>
    </Box>
  )
}

TriggerEdit.propTypes = {
  editing: PropTypes.object,
  methods: PropTypes.object.isRequired,
  messageTemplates: PropTypes.array.isRequired,
}
export default TriggerEdit
