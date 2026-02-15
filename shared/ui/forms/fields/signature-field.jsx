import React from 'react'
import PropTypes from 'prop-types'
import { connectField, filterDOMProps } from 'uniforms'
import { FormLabel, Paper, IconButton, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import SignatureCanvas from 'react-signature-canvas'

const useStyles = makeStyles((theme) => ({
  sigCanvas: {
    width: '100%',
    height: '150px',
    borderRadius: '4px',
    border: '2px solid #ccc',
  },
}))

function Signature({ sigRef, setDisabled, id, name = () => {} }) {
  const classes = useStyles()

  return (
    <SignatureCanvas
      penColor="green"
      ref={sigRef}
      canvasProps={{ className: classes.sigCanvas, 'data-cy': 'signCanvas' }}
      onEnd={() => setDisabled(false)}
      id={id}
      name={name}
    />
  )
}

Signature.propTypes = {
  sigRef: PropTypes.object.isRequired,
  setDisabled: PropTypes.func,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default connectField(Signature, { kind: 'leaf' })
