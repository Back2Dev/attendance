import React, { Fragment } from 'react'
import { connectField } from 'uniforms'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
// import FormLabel from '@material-ui/core/FormLabel'

const RadioImageField = ({ options, onChange, value, required }) => {
  return (
    <FormControl component="fieldset" required={required}>
      <RadioGroup
        onChange={({ target: { value } }) => onChange(value)}
        value={value || ''}
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
