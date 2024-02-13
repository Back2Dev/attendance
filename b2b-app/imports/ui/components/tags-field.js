/* eslint-disable no-use-before-define */
import React from 'react'
// import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { FieldProps, connectField, filterDOMProps } from 'uniforms'

const debug = require('debug')('app:tags-field')

function Tags({
  disabled,
  error,
  errorMessage,
  helperText,
  InputLabelProps,
  inputRef,
  label,
  labelProps = { shrink: true, disableAnimation: true },
  name,
  onChange,
  options,
  placeholder,
  showInlineError,
  defaultValue,
  value,
  ...props
}) {
  // const options = ['Mr Boss', 'Bossy Dude', 'Cross Patch', 'Grumpy', 'Oh shit']
  const [val, setVal] = React.useState(defaultValue || value || [])

  return (
    <Autocomplete
      disabled={disabled}
      // error={!!error}
      fullWidth
      margin="dense"
      multiple
      value={val}
      options={options}
      onChange={(event, newValue) => {
        debug({ newValue })
        setVal(newValue)
        onChange(newValue)
      }}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label={label} placeholder={label} />
      )}
    />
  )
}

export default connectField(Tags, { kind: 'leaf' })
