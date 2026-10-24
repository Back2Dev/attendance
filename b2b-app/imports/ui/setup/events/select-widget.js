import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import {
  ariaDescribedByIds,
  enumOptionSelectedValue,
  enumOptionValueDecoder,
  enumOptionValueEncoder,
  getOptionValueFormat,
  labelValue,
} from '@rjsf/utils'

// Custom SelectWidget for MUI v5 — replaces RJSF's slotProps with MUI v5 equivalents.
export default function SelectWidget(props) {
  const {
    schema,
    id,
    name,
    htmlName,
    options,
    label,
    hideLabel,
    required,
    disabled,
    placeholder,
    readonly,
    value,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    errorSchema,
    rawErrors = [],
    registry,
    uiSchema,
    hideError,
    formContext,
    slotProps, // consumed, not forwarded
    ...textFieldProps
  } = props

  const { enumOptions, enumDisabled, emptyValue: optEmptyVal } = options
  const optionValueFormat = getOptionValueFormat(options)
  const isMultiple = typeof multiple === 'undefined' ? false : !!multiple
  const emptyValue = isMultiple ? [] : ''
  const isEmpty =
    typeof value === 'undefined' ||
    (isMultiple && value.length < 1) ||
    (!isMultiple && value === emptyValue)

  const handleChange = ({ target: { value: v } }) =>
    onChange(enumOptionValueDecoder(v, enumOptions, optionValueFormat, optEmptyVal))
  const handleBlur = ({ target }) =>
    onBlur(id, enumOptionValueDecoder(target?.value, enumOptions, optionValueFormat, optEmptyVal))
  const handleFocus = ({ target }) =>
    onFocus(id, enumOptionValueDecoder(target?.value, enumOptions, optionValueFormat, optEmptyVal))

  const showPlaceholderOption = !isMultiple && schema.default === undefined

  const { InputLabelProps, SelectProps, autocomplete, ...remainingProps } = textFieldProps

  return (
    <TextField
      id={id}
      name={htmlName || id}
      label={labelValue(label || undefined, hideLabel, undefined)}
      value={enumOptionSelectedValue(value, enumOptions, isMultiple, optionValueFormat, emptyValue)}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      autoComplete={autocomplete}
      placeholder={placeholder}
      error={rawErrors.length > 0}
      select
      InputLabelProps={{ shrink: !isEmpty, ...InputLabelProps }}
      SelectProps={{ multiple, ...SelectProps }}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-describedby={ariaDescribedByIds(id)}
      {...remainingProps}
    >
      {showPlaceholderOption && <MenuItem value="">{placeholder}</MenuItem>}
      {Array.isArray(enumOptions) &&
        enumOptions.map(({ value: enumValue, label: enumLabel }, i) => {
          const isDisabled = Array.isArray(enumDisabled) && enumDisabled.includes(enumValue)
          return (
            <MenuItem
              key={String(enumValue)}
              value={enumOptionValueEncoder(enumValue, i, optionValueFormat)}
              disabled={isDisabled}
            >
              {enumLabel}
            </MenuItem>
          )
        })}
    </TextField>
  )
}
