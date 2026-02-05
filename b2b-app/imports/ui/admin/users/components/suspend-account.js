import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

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
