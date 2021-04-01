import React from 'react'
import MuiPhoneNumber from 'material-ui-phone-number'
import { connectField } from 'uniforms'
import PropTypes from 'prop-types'

function MaterialPhoneNumber({ defaultValue, onChange, error }) {
  const [value, setValue] = React.useState(defaultValue)

  const handleChange = (value) => {
    const stripped = value.replace(/\s|\+/g, '')
    setValue(stripped)
    onChange(stripped)
  }

  return (
    <MuiPhoneNumber
      defaultCountry="au"
      onChange={(value) => handleChange(value)}
      label="Enter Mobile number"
      value={value}
      error={error != null}
      fullWidth
    />
  )
}

MaterialPhoneNumber.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
}

export default connectField(MaterialPhoneNumber)
