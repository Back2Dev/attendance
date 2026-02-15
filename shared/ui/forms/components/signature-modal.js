import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import html2r from 'html-react-parser'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'
import { useSetting } from '../../utils/use-settings'

const ValidateAndSign = ({
  agree,
  userSigUrl,
  error,
  smsRef,
  handleInputError,
  handleSignature,
  noResend,
  handleResendSMSCode,
  verbiage,
}) => {
  return (
    <>
      <TextField
        data-cy="enter-code-field"
        name="enter-code-field"
        label={!error ? 'Enter security code' : error}
        inputRef={smsRef}
        variant="outlined"
        size="small"
        onChange={handleInputError}
        error={error}
        inputProps={{ maxLength: 4 }}
        onKeyPress={async (e) => {
          if (e.key === 'Enter') {
            await handleSignature()
          }
        }}
      ></TextField>
      {!noResend && (
        <Button
          data-cy="sign-submit"
          onClick={handleResendSMSCode}
          color="inherit"
          variant="contained"
        >
          Resend SMS
        </Button>
      )}
      <Button
        data-cy="sign-submit"
        onClick={handleSignature}
        color="primary"
        variant="contained"
        disabled={!agree || !userSigUrl}
      >
        {verbiage?.submit || 'Sign document'}
      </Button>
    </>
  )
}

ValidateAndSign.propTypes = {
  agree: PropTypes.bool,
  userSigUrl: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  smsRef: PropTypes.object,
  handleInputError: PropTypes.func,
  handleSignature: PropTypes.func,
  noResend: PropTypes.bool,
  handleResendSMSCode: PropTypes.func,
  verbiage: PropTypes.object,
}

const setStorageWithExpiry = ({ key, value, ttl }) => {
  const now = new Date()

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
  return true
}

const getValidFromStorage = (key) => {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) {
    return
  }

  const item = JSON.parse(itemStr)
  const now = new Date()
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return
  }
  return item.value
}

export default function SignatureModal({
  handleClose,
  open,
  addSignature,
  verbiage,
  userSigUrl,
  signer,
  getSMSCode,
  checkSMSCode,
  invalidateSMSCodes,
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const [agree, setAgree] = useState(false)
  const [valid, setValid] = useState(false)
  const [noResend, setNoResend] = useState(true)
  const [error, setError] = useState(false)
  const smsRef = useRef(null)
  const [attempts, setAttempts] = useState(0)

  const validDuration = useSetting({
    key: 'sms-valid',
    type: 'number',
    defaultValue: 100000,
  })
  const noResendDuration = useSetting({
    key: 'no-sms-resend',
    type: 'number',
    defaultValue: 50000,
  })

  useEffect(() => {
    if (getValidFromStorage('sms_valid')) {
      setValid(true)
      setAgree(true)
    }
    if (!getValidFromStorage('no_resend')) setNoResend(false)
  }, [])

  useEffect(() => {
    // check localstorage every minute to see if user can resend sms
    const interval = setInterval(() => {
      if (!getValidFromStorage('no_resend')) {
        setNoResend(false)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleAgree = () => {
    setAgree(!agree)
  }

  const handleSignature = async () => {
    const { status, message } = await checkSMSCode(smsRef.current.value)
    if (status === 'failed') {
      setAttempts(attempts + 1)
      if (attempts > 10) {
        invalidateSMSCodes()
        setValid(false)
        setAttempts(0)
        setError(false)
        return showError('Too many attempts, please request code again')
      }
      return setError(message)
    }
    localStorage.removeItem('sms_valid')
    smsRef.current.value = ''
    setValid(false)
    addSignature({ signer })
    handleClose()
  }

  const handleGetSMSCode = async () => {
    const { status, message } = await getSMSCode()
    if (status === 'success') {
      showSuccess('SMS code sent')
      setStorageWithExpiry({ key: 'no_resend', value: true, ttl: noResendDuration })
      setNoResend(true)
      const stored = setStorageWithExpiry({
        key: 'sms_valid',
        value: true,
        ttl: validDuration,
        setItem: setValid,
      })
      if (stored) setValid(true)
      return
    }
    return showError(message)
  }

  const handleResendSMSCode = async () => {
    await handleGetSMSCode()
    setAttempts(0)
    setError(false)
    smsRef.current.value = ''
    setStorageWithExpiry({ key: 'no_resend', value: true, ttl: noResendDuration })

    setNoResend(true)
  }

  const handleInputError = () => {
    if (error) {
      setError(false)
    }
    const inputValue = smsRef.current.value
    if (inputValue && !/^\d+$/.test(inputValue)) {
      setError('Only numbers')
    }
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
          {verbiage?.title || 'Important information'}
        </DialogTitle>
        <DialogContent>
          {!userSigUrl && (
            <Alert severity="warning">
              Oops, looks like you have not uploaded your signature yet. Please upload
              your signature in your profile{' '}
              <Link to="/profile?tab=3&&goback=true">here</Link>
            </Alert>
          )}
          <DialogContentText>{verbiage?.heading}</DialogContentText>

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
          {!valid ? (
            <Button
              variant="contained"
              data-cy="get-sms-verification"
              color="primary"
              disabled={!agree}
              onClick={handleGetSMSCode}
            >
              Send SMS verification
            </Button>
          ) : (
            <ValidateAndSign
              agree={agree}
              userSigUrl={userSigUrl}
              error={error}
              smsRef={smsRef}
              handleInputError={handleInputError}
              handleSignature={handleSignature}
              noResend={noResend}
              handleResendSMSCode={handleResendSMSCode}
              verbiage={verbiage}
            />
          )}
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
  userSigUrl: PropTypes.string,
  signer: PropTypes.object,
  getSMSCode: PropTypes.func,
  checkSMSCode: PropTypes.func,
  invalidateSMSCodes: PropTypes.func,
  getSetting: PropTypes.func,
}
