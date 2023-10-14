//Native input controls support by browsers isn't perfect. Have a look at @material-ui/pickers for a richer solution.
//Just find a better way to implement DatePicker, so use KeyboardDatePicker instead of TextField

import 'date-fns'
import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        required={required}
        margin="dense"
        id={id}
        label={label}
        format="MM/dd/yyyy"
        value={value || new Date()}
        onChange={(date) => onChange(date)}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        fullWidth
        placeholder={placeholder}
        error={error}
        helperText={!error && helperText}
        inputVariant="outlined"
      />
    </MuiPickersUtilsProvider>
  )
}

export default connectField(DateField)
