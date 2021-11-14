import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function SuspendAccount({ suspendProfile, name }) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen} fullWidth>
        Suspend account
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Suspend account</DialogTitle>
        <DialogContent>
          Are you sure you want to suspend {name || 'this user'}'s account?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              suspendProfile()
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

SuspendAccount.propTypes = {
  name: PropTypes.string.isRequired,
  suspendProfile: PropTypes.func.isRequired,
}
