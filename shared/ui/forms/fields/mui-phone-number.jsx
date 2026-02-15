import React from 'react'
import PropTypes from 'prop-types'
import { MuiTelInput } from 'mui-tel-input'
import { Tooltip } from '@mui/material'
import { connectField } from 'uniforms'
import { styled } from '@mui/material/styles'

// this will fix issue on FireFox browser
const StyledMuiPhoneNumber = styled('div')`
  .MuiPhoneNumber-flagButton {
    width: 30px;
  }
`

function MaterialPhoneNumber({ onChange, error, value, variant, label }) {
  return (
    <Tooltip
      title={
        <div>
          Phone numbers should include the country (+1 for USA) <br />
          +1 XXX XXX XXX
        </div>
      }
      placement="top-start"
    >
      <StyledMuiPhoneNumber>
        <MuiTelInput
          defaultCountry="us"
          onChange={(value) => onChange(value)}
          label={label ?? 'Mobile number'}
          name="mobile"
          value={/^\+/.test(value) ? value : `+${value}`}
          error={error !== null}
          fullWidth
          variant={variant || 'outlined'}
        />
      </StyledMuiPhoneNumber>
    </Tooltip>
  )
}

MaterialPhoneNumber.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.object,
}

export default connectField(MaterialPhoneNumber)
