import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { Typography, Modal, Paper, TextField, Button } from '@material-ui/core'

import { JobsDetailsContext } from './context'

const StyledCall = styled.div``

const StyledBoxContent = styled.div`
  padding: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  max-width: 500px;
  transform: translate(-50%, -50%);
  .paper {
    padding: 10px;
    h2 {
      margin: 20px 0;
    }
    .btns {
      margin: 20px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
`

function CallLog() {
  const { item, addHistory } = useContext(JobsDetailsContext)

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const showForm = () => {
    setOpen(true)
  }

  const hideForm = () => {
    setOpen(false)
  }

  const onSubmit = () => {
    addHistory(`Call log: ${message}`, true)
    setMessage('')
    setOpen(false)
  }

  if (!item?.phone) {
    return null
  }

  return (
    <StyledCall>
      <Button variant="contained" onClick={showForm}>
        Call
      </Button>

      <Modal
        open={open}
        onClose={hideForm}
        aria-labelledby="Call log"
        aria-describedby="Enter a call log"
      >
        <StyledBoxContent elevation={3}>
          <Paper className="paper">
            <Typography variant="h2">Call log</Typography>
            <TextField
              multiline
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="btns">
              <Button
                variant="contained"
                onClick={() => {
                  setMessage('')
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
                disabled={!message}
              >
                Submit
              </Button>
            </div>
          </Paper>
        </StyledBoxContent>
      </Modal>
    </StyledCall>
  )
}

export default CallLog
