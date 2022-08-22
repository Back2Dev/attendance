// import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField'
// import React from 'react'
// import { FieldProps, connectField, filterDOMProps } from 'uniforms'

// const DateConstructor = (typeof global === 'object' ? global : window).Date
// const dateFormat = (value) => value && value.toISOString().slice(0, 10)
// const dateParse = (timestamp, onChange) => {
//   const date = new DateConstructor(timestamp)
//   if (date.getFullYear() < 10000) {
//     onChange(date)
//   } else if (isNaN(timestamp)) {
//     onChange(undefined)
//   }
// }

// function Date({
//   disabled,
//   error,
//   errorMessage,
//   helperText,
//   InputLabelProps,
//   inputRef,
//   label,
//   labelProps = { shrink: true, disableAnimation: true },
//   name,
//   onChange,
//   placeholder,
//   showInlineError,
//   value,
//   ...props
// }) {
//   return (
//     <TextField
//       disabled={disabled}
//       error={!!error}
//       fullWidth
//       helperText={(error && showInlineError && errorMessage) || helperText}
//       label={label}
//       InputLabelProps={{ ...labelProps, ...InputLabelProps }}
//       margin="dense"
//       name={name}
//       onChange={(event) =>
//         // FIXME: `valueAsNumber` is not available in `EventTarget`.
//         disabled || dateParse(event.target.valueAsNumber, onChange)
//       }
//       placeholder={placeholder}
//       ref={inputRef}
//       type="date"
//       value={dateFormat(value) ?? ''}
//       {...filterDOMProps(props)}
//     />
//   )
// }

// export default connectField(Date, { kind: 'leaf' })

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
