import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField'
import { FieldProps, connectField, filterDOMProps } from 'uniforms'

function Lookup({
  disabled,
  error,
  errorMessage,
  helperText,
  InputLabelProps,
  inputRef,
  label,
  labelProps = { shrink: true, disableAnimation: true },
  name,
  // options,
  onChange,
  placeholder,
  showInlineError,
  defaultValue,
  value,
}) {
  const options = ['Mr Boss', 'Bossy Dude']
  const [val, setVal] = React.useState(defaultValue || value)

  return (
    <Autocomplete
      disabled={disabled}
      error={!!error}
      fullWidth
      label={label}
      margin="dense"
      name={name}
      freeSolo
      defaultValue={val || ''}
      onChange={(event, newValue) => {
        setVal(newValue)
        onChange(newValue)
      }}
      options={options}
      placeholder={placeholder}
      ref={inputRef}
      renderInput={(params) => (
        <TextField {...params} label={label} margin="dense" variant="outlined" />
      )}
    />
  )
}

export default connectField(Lookup, { kind: 'leaf' })
