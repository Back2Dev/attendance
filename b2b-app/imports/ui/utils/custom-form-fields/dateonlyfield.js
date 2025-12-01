import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'

function DateOnlyField({ onChange, value, disabled = false }) {
  const [newValue, setNewValue] = React.useState(value || null)

  const handleChange = (_value) => {
    if (_value) {
      setNewValue(_value._d)
      onChange(_value._d)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'normal',
            id: 'date-picker',
            label: 'Birthday Date',
            disabled,
          },
        }}
        value={newValue}
        minDate={!disabled && moment()}
        format="DD/MM/yyyy"
        views={['year', 'month', 'date']}
        onChange={handleChange}
      />
    </LocalizationProvider>
  )
}

DateOnlyField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
  disabled: PropTypes.bool,
}

export default connectField(DateOnlyField)
