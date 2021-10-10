import React, { useContext } from 'react'
import styled from 'styled-components'

import { Button } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'

import { useConfirm } from '../../commons/confirm-box'
import CONSTANTS from '../../../../api/constants'
import { JobsDetailsContext } from './context'
import CallLog from './actions-call'
import SendSMS from './actions-sms'
import MechanicSelector from './actions-mechanic'

const StyledJobActions = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: top;
  .left {
    button {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    justify-content: center;
    button {
      margin-left: 10px;
      margin-bottom: 5px;
    }
  }
  ${({ theme }) => `
    ${theme.breakpoints.down('xs')} {
      flex-direction: column;
      .left {
        margin-bottom: 10px;
      }
      .right {
        justify-content: flex-start;
        button {
          margin-left: 0;
          margin-right: 10px;
        }
      }
    }`}
`

function JobActions() {
  const { item, loading, updateJobStatus, markAsPaid } = useContext(JobsDetailsContext)

  const { showConfirm } = useConfirm()

  const onSetStatus = (status) => {
    console.log('next status', status)
    if (['cancelled', 'completed'].includes(status)) {
      // need to confirm before set the status
      showConfirm({
        onConfirm: () => updateJobStatus(status),
      })
    } else if (
      status === 'in-progress' &&
      ['cancelled', 'completed'].includes(item.status)
    ) {
      showConfirm({
        onConfirm: () => updateJobStatus(status),
      })
    } else {
      updateJobStatus(status)
    }
  }

  const onMarkAsPaid = () => {
    // need to confirm before update the job
    showConfirm({
      onConfirm: () => markAsPaid(status),
    })
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

  const renderMarkAsPaidBtn = () => {
    if (item?.paid) {
      return null
    }
    return (
      <Button
        variant="contained"
        onClick={() => onMarkAsPaid()}
        disabled={loading}
        startIcon={<AttachMoneyIcon />}
      >
        Mark as paid
      </Button>
    )
  }

  return (
    <StyledJobActions>
      <div className="left">{renderStatusActions()}</div>
      <div className="right">
        <MechanicSelector />
        {renderMarkAsPaidBtn()}
        <CallLog />
        <SendSMS />
      </div>
    </StyledJobActions>
  )
}

export default JobActions
