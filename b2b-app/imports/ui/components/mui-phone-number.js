import React from 'react'
import MuiPhoneNumber from 'material-ui-phone-number'
import { connectField } from 'uniforms'
import PropTypes from 'prop-types'

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
    <MuiPhoneNumber
      defaultCountry="au"
      onChange={(value) => handleChange(value)}
      helperText={error ? errorMessage : helperText}
      value={value}
      error={error != null}
      // label={label}
      fullWidth
      variant="outlined"
      margin="dense"
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
