import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { GreenButton } from '/imports/ui/utils/generic'

export default function RestoreAccount({ setActiveProfile, name }) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <GreenButton onClick={handleClickOpen} fullWidth>
        Restore account
      </GreenButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Restore account</DialogTitle>
        <DialogContent>
          Are you sure you want to restore {name || 'this user'}'s account?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setActiveProfile()
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

RestoreAccount.propTypes = {
  name: PropTypes.string.isRequired,
  setActiveProfile: PropTypes.func.isRequired,
}
