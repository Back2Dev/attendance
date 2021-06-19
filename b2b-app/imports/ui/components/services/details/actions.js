import React, { useContext } from 'react'
import styled from 'styled-components'

import { Button, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import CONSTANTS from '../../../../api/constants'
import { JobsDetailsContext } from './context'

const StyledJobActions = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: top;
  .left {
    button {
      margin-right: 10px;
    }
  }
  .right {
    button {
      margin-left: 10px;
      margin-bottom: 5px;
    }
  }
`

function JobActions() {
  const { item, loading, updateJobStatus } = useContext(JobsDetailsContext)

  const onSetStatus = (status) => {
    console.log('next status', status)
    updateJobStatus(status)
  }

  const renderStatusActions = () => {
    if (!item || loading) {
      return <Skeleton width="100" />
    }
    const availableBtns = CONSTANTS.JOB_STATUS_MAPPING[item.status]
    if (!availableBtns) {
      return null
    }
    return availableBtns.map(({ next, label }) => {
      return (
        <Button
          variant="contained"
          key={next}
          onClick={() => onSetStatus(next)}
          disabled={loading}
        >
          {label}
        </Button>
      )
    })
  }

  return (
    <StyledJobActions>
      <div className="left">{renderStatusActions()}</div>
      <div className="right">
        <Button variant="contained">Mark as paid</Button>
        <Button variant="contained">Call</Button>
        <Button variant="contained">SMS</Button>
      </div>
    </StyledJobActions>
  )
}

export default JobActions
