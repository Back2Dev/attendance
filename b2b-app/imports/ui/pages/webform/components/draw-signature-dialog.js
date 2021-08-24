import React, { useRef, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Signature from '/imports/ui/components/signature.js'

const SignatureDialog = ({ open, handleClose, submitSignature }) => {
  const [disabled, setDisabled] = useState(true)
  const sigRef = useRef()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Draw signature</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Signature sigRef={sigRef} setDisabled={setDisabled} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={disabled}
          variant="contained"
          color="primary"
          onClick={() => {
            submitSignature(sigRef)
            handleClose()
          }}
          fullWidth
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

SignatureDialog.propTypes = {}

export default SignatureDialog
