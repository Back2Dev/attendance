import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'

export default function SignatureModal({
  handleClose,
  open,
  addSignature,
  verbiage,
  userSigUrl,
  signer,
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [agree, setAgree] = React.useState(false)

  const handleAgree = () => {
    setAgree(!agree)
  }

  const handleSignature = () => {
    addSignature({ signer })
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
          {verbiage?.title || 'Important Information'}
        </DialogTitle>
        <DialogContent>
          {!userSigUrl && (
            <Alert severity="warning">
              Oops, looks like you have not uploaded your signature yet. Please upload
              your signature in your profile{' '}
              <Link to="/profile?tab=3&&goback=true">here</Link>
            </Alert>
          )}
          <DialogContentText>
            {verbiage?.heading || 'Please ensure you have read the terms and conditions'}
          </DialogContentText>

          {verbiage?.paragraphs.map((para, ix) => (
            <DialogContentText key={ix}>
              <Typography component="span" gutterBottom>
                {html2r(para)}
              </Typography>
            </DialogContentText>
          ))}

          <FormControlLabel
            control={
              <Checkbox
                data-cy="sign-agreement"
                checked={agree}
                disabled={!userSigUrl}
                onChange={handleAgree}
                name="agreement"
              />
            }
            label={verbiage?.agreeTick || 'I agree'}
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
            variant="contained"
            disabled={!agree || !userSigUrl}
          >
            {verbiage?.submit || 'Sign document'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

SignatureModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  addSignature: PropTypes.func.isRequired,
  verbiage: PropTypes.object.isRequired,
}
