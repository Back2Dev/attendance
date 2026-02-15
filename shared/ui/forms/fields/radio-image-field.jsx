import React, { Fragment } from 'react'
import { connectField } from 'uniforms'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
// import FormLabel from '@mui/material/FormLabel'

const RadioImageField = ({ options, onChange, value, name, required }) => {
  return (
    <FormControl component="fieldset" required={required}>
      <RadioGroup
        onChange={({ target: { value } }) => onChange(value)}
        value={value || ''}
        name={name}
      >
        {options.map(({ label, value, image }) => (
          <Fragment key={value}>
            <FormControlLabel value={value} control={<Radio />} label={label} />
            {image && (
              <img src={image} width="75px" height="75px" style={{ display: 'block' }} />
            )}
          </Fragment>
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default connectField(RadioImageField)
