import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

export default function FormDialog({ handleClose, open, addSignature }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [agree, setAgree] = React.useState(false)

  const handleAgree = () => {
    setAgree(!agree)
  }

  const handleSignature = () => {
    addSignature()
    handleClose()
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle data-cy="sign-modal-h1" id="form-dialog-title">
          Important Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Before signing this document, please ensure you have read through document and
            understand what you are signing.
          </DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                data-cy="sign-agreement"
                checked={agree}
                onChange={handleAgree}
                name="agreement"
              />
            }
            label="I understand and agree to what I am signing"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            data-cy="sign-submit"
            onClick={handleSignature}
            color="primary"
            disabled={!agree}
          >
            Sign document
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

FormDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  addSignature: PropTypes.func.isRequired,
}
