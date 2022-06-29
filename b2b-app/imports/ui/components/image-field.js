import React, { Fragment } from 'react'
import { connectField } from 'uniforms'
import { Box } from '@material-ui/core'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

const ImageField = ({ value }) => {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {value.map((value) => (
        <div key={value}>
          <input type="radio" id="huey" name="drone" value={value} />
          <img
            alt=""
            style={{ width: '100px', height: '100px' }}
            src={value || 'https://picsum.photos/150?grayscale'}
          />
        </div>
      ))}
    </div>
  )
}

export default connectField(ImageField)

export const RadioFieldWithImage = connectField(({ options, label, required }) => {
  console.log('required', required)
  return (
    <FormControl component="fieldset" required={required}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup>
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
})
