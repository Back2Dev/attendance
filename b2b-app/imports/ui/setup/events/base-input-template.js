import React, { useCallback } from 'react'
import TextField from '@mui/material/TextField'
import { ariaDescribedByIds, examplesId, getInputProps, labelValue } from '@rjsf/utils'

const SHRINK_TYPES = ['date', 'datetime-local', 'file', 'time']

// Custom BaseInputTemplate for MUI v5 — RJSF v6 uses MUI v6's slotProps API which
// MUI v5 doesn't support, causing DOM prop warnings. This maps to MUI v5 equivalents.
export default function BaseInputTemplate(props) {
  const {
    id,
    name,
    htmlName,
    placeholder,
    required,
    readonly,
    disabled,
    type,
    label,
    hideLabel,
    hideError,
    value,
    onChange,
    onChangeOverride,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    uiSchema,
    rawErrors = [],
    errorSchema,
    registry,
    InputLabelProps,
    InputProps,
    slotProps, // consumed here, not forwarded to DOM
    ...textFieldProps
  } = props

  const { step, min, max, accept, ...rest } = getInputProps(schema, type, options)

  // Strip any remaining RJSF-internal props that must not reach the DOM
  const {
    formContext,
    autofocus: _af,
    ...safeTextFieldProps
  } = textFieldProps

  const inputProps = { step, min, max, accept, ...InputProps }
  const inputLabelProps = SHRINK_TYPES.includes(type)
    ? { ...InputLabelProps, shrink: true }
    : InputLabelProps

  const handleChange = ({ target: { value: v } }) =>
    onChange(v === '' ? options.emptyValue : v)
  const handleBlur = ({ target }) => onBlur(id, target?.value)
  const handleFocus = ({ target }) => onFocus(id, target?.value)

  return (
    <TextField
      id={id}
      name={htmlName || id}
      placeholder={placeholder}
      label={labelValue(label || undefined, hideLabel, undefined)}
      autoFocus={autofocus}
      required={required}
      disabled={disabled || readonly}
      value={value || value === 0 ? value : ''}
      error={rawErrors.length > 0}
      InputProps={inputProps}
      InputLabelProps={inputLabelProps}
      inputProps={{ step, min, max, accept }}
      onChange={onChangeOverride || handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-describedby={ariaDescribedByIds(id, !!schema.examples)}
      {...rest}
      {...safeTextFieldProps}
    />
  )
}
