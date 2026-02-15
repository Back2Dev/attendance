import React, { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material'

const DataDeletionDialog = ({ open, onClose, onContinue, type }) => {
  const [dataAction, setDataAction] = useState('')

  const handleContinue = () => {
    onContinue(dataAction)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Warning: Data Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This person has entered data into the form, and it may be complete.
          <br />
          <br />
          Please choose one of the following options:
        </DialogContentText>
        <FormControl>
          <RadioGroup
            aria-label="data-action"
            name="data-action"
            value={dataAction}
            onChange={(e) => setDataAction(e.target.value)}
          >
            <FormControlLabel
              value="keep"
              control={<Radio />}
              label="Keep the data"
              data-cy="keep"
            />
            <FormControlLabel
              value="delete"
              control={<Radio />}
              label="Delete the data"
              data-cy="delete"
            />
          </RadioGroup>
          <DialogContentText>
            If you delete the data, a new token will be created for the{' '}
            {type === 'KP' ? 'Key Personnel' : 'Key Outside Influence'}.
          </DialogContentText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button id="dialog-cancel" data-cy="dialog-cancel" onClick={onClose}>
          Cancel
        </Button>
        <Button
          name="dialog-continue"
          data-cy="dialog-continue"
          onClick={handleContinue}
          disabled={!dataAction}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DataDeletionDialog
