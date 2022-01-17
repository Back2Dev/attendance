import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import {
  Typography,
  Button,
  Modal,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@material-ui/core'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'

import { JobsDetailsContext } from './context'
import Autocomplete from '@material-ui/lab/Autocomplete'

const StyledQualityCheck = styled.div``
const StyledModalContent = styled.div`
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
    .failed-reason {
      display: flex;
    }
    .btns {
      margin: 20px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
`

function QualityCheck() {
  const { item, updateJobStatus, mechanics } = useContext(JobsDetailsContext)

  const [open, setOpen] = useState(true)
  const [selectedMechanic, setSelectedMechanic] = useState(null)
  const [checkResult, setCheckResult] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    console.log('submit')
    switch (checkResult) {
      case 'passed': {
        updateJobStatus(
          'ready',
          `Quality check: Passed. Mechanic: ${selectedMechanic?.name}`
        )
        break
      }
      case 'failed': {
        updateJobStatus(
          'in-progress',
          `Quality check: Failed. Mechanic: ${selectedMechanic?.name}. Reason: ${reason}`
        )
        break
      }
      default:
        break
    }
  }

  if (item?.status !== 'quality-check') {
    return null
  }

  return (
    <StyledQualityCheck>
      <Button
        variant="contained"
        startIcon={<AssignmentTurnedInIcon />}
        onClick={() => setOpen(true)}
      >
        QA
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="qa-modal-title"
        aria-describedby="qa-modal-description"
      >
        <StyledModalContent>
          <Paper className="paper">
            <Typography variant="h2" id="qa-modal-title">
              Quality check
            </Typography>
            <div id="qa-modal-description">
              <Autocomplete
                options={mechanics}
                getOptionLabel={(option) => option.name}
                style={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField {...params} label="Mechanic" data-cy="qa-mechanic" variant="outlined" />
                )}
                value={selectedMechanic}
                onChange={(e, selected) => setSelectedMechanic(selected)}
              />
              <FormControl>
                <RadioGroup
                  row
                  aria-label="check-result"
                  name="check-result"
                  value={checkResult}
                  onChange={(event) => setCheckResult(event.target.value)}
                >
                  <FormControlLabel value="passed" id="qa-passed" control={<Radio />} label="Passed" />
                  <FormControlLabel value="failed" id="qa-failed"control={<Radio />} label="Failed" />
                </RadioGroup>
              </FormControl>
              {checkResult === 'failed' && (
                <TextField
                  className="failed-reason"
                  id="failed-reason"
                  label="Reason"
                  multiline
                  rows={4}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  variant="outlined"
                />
              )}
              <div className="btns">
                <Button variant="outlined"   data-cy="qa-cancel"onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  data-cy="qa-submit"
                  onClick={handleSubmit}
                  disabled={
                    !selectedMechanic ||
                    !checkResult ||
                    (checkResult === 'failed' && !reason)
                  }
                >
                  Submit
                </Button>
              </div>
            </div>
          </Paper>
        </StyledModalContent>
      </Modal>
    </StyledQualityCheck>
  )
}

export default QualityCheck
