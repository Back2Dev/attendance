//'material-ui-phone-number' hasn't updated for a while, so try react-phone-number-input to see if better

import React from 'react'
import { connectField } from 'uniforms'
import { TextField } from '@material-ui/core'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const MuiTextField = React.forwardRef((props, ref) => {
  return <TextField inputProps={{ maxLength: 20 }} inputRef={ref} {...props} />
})

function PhoneField({ id, placeholder, required, value, onChange, helperText, label }) {
  //if turn on international property, then placeholder will not work
  return (
    <PhoneInput
      id={id}
      margin="dense"
      defaultCountry="AU"
      international
      withCountryCallingCode
      countryCallingCodeEditable={false}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      helperText={helperText}
      // label="Phone-Number"
      label={label}
      inputComponent={MuiTextField}
      required={required}
      variant="outlined"
    />
  )
}

export default connectField(PhoneField)
