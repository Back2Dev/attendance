import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { FormControl, InputLabel, Input, InputAdornment } from '@material-ui/core'

function CostField({ onChange, value, name, label }) {
  const [newValue, setNewValue] = React.useState(value)

  const handleChange = (_value) => {
    setNewValue(_value)
    onChange(_value)
  }

  return (
    <FormControl fullWidth style={{ marginTop: '1em' }}>
      <InputLabel htmlFor={`cost-adorment-${name}`}>{label}</InputLabel>
      <Input
        id={`cost-adorment-${name}`}
        value={newValue}
        onChange={(e) => handleChange(e.target.value)}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  )
}

CostField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default connectField(CostField)
