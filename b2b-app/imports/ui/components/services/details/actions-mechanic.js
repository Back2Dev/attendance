import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Typography, Modal, Paper, TextField, Button } from '@material-ui/core'
import BuildIcon from '@material-ui/icons/Build'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { JobsDetailsContext } from './context'

const StyledMechanicSelector = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .name {
    margin-right: 5px;
  }
`

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

function MechanicSelector() {
  const { item, loading, mechanics, updateJobMechanic } = useContext(JobsDetailsContext)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const showSelector = () => {
    setOpen(true)
  }

  const hideSelector = () => {
    setOpen(false)
  }

  const onSelectMechanic = () => {
    updateJobMechanic(selected?.userId || '')
    setOpen(false)
  }

  const selectedMechanic = useMemo(() => {
    if (!item?.mechanic) {
      return null
    }
    const found = mechanics.find((mer) => {
      return mer.userId === item.mechanic
    })
    return found || null
  }, [item?.mechanic, mechanics])

  // console.log(selectedMechanic)

  return (
    <StyledMechanicSelector>
      <Button
        variant="contained"
        onClick={() => showSelector()}
        disabled={loading}
        startIcon={<BuildIcon />}
      >
        {selectedMechanic ? selectedMechanic.name : 'Select mechanic'}
      </Button>

      <Modal
        open={open}
        onClose={hideSelector}
        aria-labelledby="Mechanic selector"
        aria-describedby="Select a Mechanic"
      >
        <StyledBoxContent elevation={3}>
          <Paper className="paper">
            <Typography variant="h2">Select a mechanic</Typography>
            <Autocomplete
              options={mechanics}
              getOptionLabel={(option) => option.name}
              style={{ width: '100%' }}
              renderInput={(params) => (
                <TextField {...params} label="Mechanic" variant="outlined" />
              )}
              value={selected || selectedMechanic}
              onChange={(e, selected) => setSelected(selected)}
            />
            <div className="btns">
              <Button
                variant="contained"
                onClick={() => {
                  setSelected(null)
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={onSelectMechanic}>
                Select
              </Button>
            </div>
          </Paper>
        </StyledBoxContent>
      </Modal>
    </StyledMechanicSelector>
  )
}

export default MechanicSelector
