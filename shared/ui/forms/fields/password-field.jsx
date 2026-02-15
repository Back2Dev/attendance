import React, { useState } from 'react'
import { connectField } from 'uniforms'
import { IconButton, Box } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export const PasswordField = ({
  id,
  placeholder,
  onChange,
  value,
  label,
  required,
  helperText,
  error,
  textFieldProps,
}) => {
  const [hide, setHide] = useState(true)
  const toggle = () => setHide((prev) => !prev)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <TextField
      error={error ? true : false}
      required={required}
      label={label}
      id={id}
      variant="outlined"
      margin="dense"
      type={hide ? 'password' : 'text'}
      fullWidth
      value={value || ''}
      onChange={({ target: { value } }) => onChange(value)}
      placeholder={placeholder}
      helperText={error ? error.message : helperText}
      autoComplete="false"
      {...textFieldProps}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={toggle}
              onMouseDown={handleMouseDownPassword}
            >
              {hide ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export default connectField(PasswordField, { kind: 'leaf' })
