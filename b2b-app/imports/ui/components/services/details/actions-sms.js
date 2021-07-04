import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import { Typography, Modal, Paper, TextField, Button } from '@material-ui/core'

import { JobsDetailsContext } from './context'

const StyledSendSMS = styled.div``

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

function SendSMS() {
  const { item, sendSMS } = useContext(JobsDetailsContext)

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const showForm = () => {
    setOpen(true)
  }

  const hideForm = () => {
    setOpen(false)
  }

  const onSubmit = () => {
    sendSMS(message)
    setMessage('')
    setOpen(false)
  }

  if (!item?.phone) {
    return null
  }

  return (
    <StyledSendSMS>
      <Button variant="contained" onClick={showForm}>
        SMS
      </Button>

      <Modal
        open={open}
        onClose={hideForm}
        aria-labelledby="Send SMS"
        aria-describedby="Enter a sms"
      >
        <StyledBoxContent elevation={3}>
          <Paper className="paper">
            <Typography variant="h2">Send SMS</Typography>
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
    </StyledSendSMS>
  )
}

export default SendSMS
