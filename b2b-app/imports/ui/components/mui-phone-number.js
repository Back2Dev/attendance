import React from 'react'
import { connectField } from 'uniforms'
import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-number-input/input'
import { TextField } from '@mui/material'

function MaterialPhoneNumber({
  defaultValue,
  onChange,
  error,
  helperText,
  errorMessage,
}) {
  const [value, setValue] = React.useState(defaultValue || '')

  const handleChange = (value) => {
    const stripped = value.replace(/\s|\+/g, '')
    setValue(stripped)
    onChange(stripped)
  }

  return (
    <TextField
      fullWidth
      variant="outlined"
      margin="dense"
      error={error != null}
      helperText={error ? errorMessage : helperText}
      InputProps={{
        inputComponent: PhoneInput,
        inputProps: {
          country: 'AU',
          value,
          onChange: handleChange,
        },
      }}
    />
  )
}

MaterialPhoneNumber.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  errorMessage: PropTypes.string,
}

export default connectField(MaterialPhoneNumber)
