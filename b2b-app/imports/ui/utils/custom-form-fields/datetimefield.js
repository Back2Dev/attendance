import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { TextField } from '@mui/material'

const debug = require('debug')('app:datetimefield')

function toInputValue(date) {
  if (!date) return ''
  // Handle strings (e.g. old DB records that stored dates as strings)
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d)) return ''
  // datetime-local expects "YYYY-MM-DDTHH:mm" in local time
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

function DateTimeField({ onChange, value, label, disabled = false }) {
  const handleChange = (e) => {
    const raw = e.target.value
    if (raw) {
      const d = new Date(raw)
      if (!isNaN(d)) {
        debug('DateTimeField onChange', d)
        onChange(d)
      }
    } else {
      onChange(undefined)
    }
  }

  return (
    <TextField
      label={label}
      type="datetime-local"
      value={toInputValue(value)}
      onChange={handleChange}
      disabled={disabled}
      fullWidth
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
  )
}

DateTimeField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date),
  label: PropTypes.string,
  disabled: PropTypes.bool,
}

export default connectField(DateTimeField)
