import React, { useState } from 'react'
import { connectField } from 'uniforms'
import { HiddenField as MuiHiddenField } from 'uniforms-mui'

export const HiddenField = ({
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
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <MuiHiddenField
      error={error ? true : false}
      required={required}
      label={label}
      id={id}
      variant="outlined"
      margin="dense"
      fullWidth
      value={value || ''}
      placeholder={placeholder}
      helperText={error ? error.message : helperText}
      autoComplete="false"
      {...textFieldProps}
    />
  )
}

export default connectField(HiddenField, { kind: 'leaf' })
