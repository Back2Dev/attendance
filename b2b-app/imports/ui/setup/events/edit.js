import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { jsonSchema, uiSchema } from './config'
import LocationWidget from './location-widget'
import RepeatWidget from './repeat-widget'
import BaseInputTemplate from './base-input-template'
import SelectWidget from './select-widget'
import EventFormTemplate from './form-template'
import useHistory from '/imports/ui/utils/history'

const widgets = { location: LocationWidget, select: SelectWidget }
const fields = {}
const templates = { BaseInputTemplate, ObjectFieldTemplate: EventFormTemplate }

const debug = require('debug')('app:setup:edit')

const Edit = ({ id, item, methods }) => {
  const [formData, setFormData] = useState(item)
  const [repeat, setRepeat] = useState(item.repeat || undefined)
  const { goBack } = useHistory()

  useEffect(() => {
    setFormData(item)
    setRepeat(item.repeat || undefined)
  }, [item])

  const toFormData = (src) => {
    const data = { ...src }
    if (data.when instanceof Date) data.when = data.when.toISOString().slice(0, 16)
    if (data.description == null) data.description = ''
    return data
  }

  const transformErrors = (errors) =>
    errors.filter((e) => !(e.property === '.description' && e.name === 'type'))

  const onSubmit = ({ formData: data }) => {
    const clean = { ...data, description: data.description ?? '', repeat }
    debug('Updating event', clean)
    try {
      methods.update(id, clean)
    } catch (e) {
      debug(`Update error ${e.message}`)
    }
  }

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', mt: 4, mb: 6, px: 2 }}>
      <Typography variant="h5" gutterBottom>Edit Event</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>{item.name}</Typography>
      <Divider sx={{ mb: 3 }} />
      <Paper elevation={2} sx={{ p: 3 }}>
        <Form
          key={id}
          schema={jsonSchema}
          uiSchema={uiSchema}
          widgets={widgets}
          fields={fields}
          templates={templates}
          formData={toFormData(formData)}
          onChange={({ formData: d }) => setFormData({ ...d, description: d.description ?? '' })}
          onSubmit={onSubmit}
          transformErrors={transformErrors}
          validator={validator}
          omitExtraData
        >
          <RepeatWidget
            value={repeat}
            onChange={setRepeat}
            when={formData?.when}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">Save</Button>
            <Button type="button" variant="outlined" onClick={goBack}>Cancel</Button>
          </Box>
        </Form>
      </Paper>
    </Box>
  )
}

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}

export default Edit
