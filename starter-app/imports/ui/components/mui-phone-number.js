import React from 'react'
import MuiPhoneNumber from 'material-ui-phone-number'
import { Tooltip } from '@material-ui/core'
import { connectField } from 'uniforms'
import PropTypes from 'prop-types'

function MaterialPhoneNumber({ defaultValue, onChange, error }) {
  const [value, setValue] = React.useState(defaultValue)

  const handleChange = (value) => {
    let stripped = value.replace(/\s|\+/g, '')
    if (stripped.slice(0, 3) === '610') {
      stripped = stripped.replace(/0/, '')
    }
    setValue(stripped)
    onChange(stripped)
  }

  return (
    <Tooltip
      title={
        <div>
          Mobile phone numbers should be in the form <br />
          +61 411 111 111
        </div>
      }
      placement="left-start"
    >
      <MuiPhoneNumber
        defaultCountry="au"
        onChange={(value) => handleChange(value)}
        label="Enter Mobile number"
        value={value}
        error={error != null}
        fullWidth
      />
    </Tooltip>
  )
}

MaterialPhoneNumber.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
}

export default connectField(MaterialPhoneNumber)
