import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { AutoForm, AutoField, ErrorField, SubmitField } from 'uniforms-material'
import PasswordBridge from '/imports/ui/utils/password-validation/password-bridge.js'
import PasswordValidator from '/imports/ui/utils/password-validation/password-validator.js'
import VpnKeyIcon from '@material-ui/icons/VpnKey'

const passwordSchema = {
  password: { type: String, label: 'New password' },
  confirmPassword: {
    type: String,
    label: 'Confirm password',
  },
}

const bridge = new PasswordBridge(passwordSchema, PasswordValidator)

export default function SetPassword({ setPassword }) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<VpnKeyIcon />}
      >
        Set password
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Set password</DialogTitle>
        <AutoForm
          schema={bridge}
          onSubmit={async (form) => {
            const { status } = await setPassword({ newPassword: form.password })
            if (status === 'success') {
              handleClose()
            }
          }}
        >
          <DialogContent>
            <AutoField name="password" type="password" fullWidth />
            <ErrorField name="password" />
            <AutoField name="confirmPassword" type="password" fullWidth />
            <ErrorField name="confirmPassword" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Cancel
            </Button>
            <SubmitField color="primary">Submit</SubmitField>
          </DialogActions>
        </AutoForm>
      </Dialog>
    </div>
  )
}

SetPassword.propTypes = {
  setPassword: PropTypes.func.isRequired,
}
