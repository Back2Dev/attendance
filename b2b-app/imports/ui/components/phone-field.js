//'material-ui-phone-number' hasn't updated for a while, so try react-phone-number-input to see if better

import React from 'react'
import { connectField } from 'uniforms'
import { TextField, Box } from '@material-ui/core'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const MuiTextField = React.forwardRef((props, ref) => {
  return <TextField inputProps={{ maxLength: 20 }} inputRef={ref} {...props} />
})

function PhoneField({ id, placeholder, required, value, onChange }) {
  // const [value, setValue] = React.useState()

  //if turn on international property, then placeholder will not work
  return (
    <Box marginTop="16px">
      <PhoneInput
        id={id}
        defaultCountry="AU"
        // international
        withCountryCallingCode
        countryCallingCodeEditable={false}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        // label="Phone-Number"
        label={placeholder}
        inputComponent={MuiTextField}
        required={required}
      />
    </Box>
  )
}

export default connectField(PhoneField)
