import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { Box, Button, FormLabel, Paper, Typography } from '@mui/material'
import SignaturePad from 'react-signature-pad-wrapper'

const SignatureField = ({
  onChange,
  value,
  label,
  error,
  helperText,
  errorMessage,
}) => {
  const padRef = useRef(null)

  const clear = () => {
    padRef.current?.clear()
    onChange('')
  }

  const save = () => {
    if (padRef.current && !padRef.current.isEmpty()) {
      onChange(padRef.current.toDataURL())
    }
  }

  return (
    <Box>
      {label && <FormLabel>{label}</FormLabel>}
      <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
        <SignaturePad ref={padRef} options={{ penColor: 'black' }} />
      </Paper>
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button size="small" onClick={clear} variant="outlined">
          Clear
        </Button>
        <Button size="small" onClick={save} variant="contained">
          Save
        </Button>
      </Box>
      {error && (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      )}
      {!error && helperText && (
        <Typography variant="caption" color="textSecondary">
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

SignatureField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  errorMessage: PropTypes.string,
}

export default connectField(SignatureField)
