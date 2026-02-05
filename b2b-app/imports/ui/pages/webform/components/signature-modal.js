import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Alert from '@mui/material/Alert'

export default function SignatureModal({
  handleClose,
  open,
  addSignature,
  verbiage,
  userSigUrl,
  signer,
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
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
