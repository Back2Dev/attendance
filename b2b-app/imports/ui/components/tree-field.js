/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { FieldProps, connectField, filterDOMProps } from 'uniforms'
import orgs from './nba-teams'

const flatten = (node, depth = 0, acc = []) => {
  acc.push({ id: node.id, name: node.name, depth })
  if (node.children) {
    node.children.forEach((child) => flatten(child, depth + 1, acc))
  }
  return acc
}

function TreeField({
  disabled,
  error,
  errorMessage,
  helperText,
  InputLabelProps,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  showInlineError,
  defaultValue,
  value,
  ...props
}) {
  const options = flatten(orgs)
  const selected = value || defaultValue || options[0]?.id

  return (
    <FormControl fullWidth margin="normal" error={!!error} disabled={disabled}>
      {label && <InputLabel shrink {...InputLabelProps}>{label}</InputLabel>}
      <Select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        inputRef={inputRef}
        displayEmpty
        renderValue={(val) => {
          const opt = options.find((o) => o.id === val)
          return opt ? opt.name : placeholder || ''
        }}
        {...filterDOMProps(props)}
      >
        {placeholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            <Typography component="span" sx={{ pl: opt.depth * 2 }}>
              {opt.name}
            </Typography>
          </MenuItem>
        ))}
      </Select>
      {helperText && !error && <Typography variant="caption">{helperText}</Typography>}
      {showInlineError && error ? (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      ) : null}
    </FormControl>
  )
}
export default connectField(TreeField, { kind: 'leaf' })
