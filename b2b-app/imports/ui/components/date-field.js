//Native input controls support by browsers isn't perfect. Have a look at @material-ui/pickers for a richer solution.
//Just find a better way to implement DatePicker, so use KeyboardDatePicker instead of TextField

import React from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { connectField } from 'uniforms'

const DateField = ({
  placeholder,
  id,
  value,
  onChange,
  required,
  helperText,
  label,
  error,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        slotProps={{
          textField: {
            required,
            margin: 'dense',
            id,
            label,
            fullWidth: true,
            placeholder,
            error,
            helperText: !error && helperText,
            variant: 'outlined',
          },
          openPickerButton: {
            'aria-label': 'change date',
          },
        }}
        format="MM/dd/yyyy"
        value={value || new Date()}
        onChange={(date) => onChange(date)}
      />
    </LocalizationProvider>
  )
}

export default connectField(DateField)
