import React, { useContext } from 'react'
import styled from 'styled-components'

import { Button, Stepper, Step, StepButton, StepLabel } from '@material-ui/core'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'

import { showWarning } from '/imports/ui/utils/toast-alerts'
import { useConfirm } from '../../commons/confirm-box'
import CONSTANTS from '../../../../api/constants'
import { JobsDetailsContext } from './context'
import CallLog from './actions-call'
import SendSMS from './actions-sms'
import MechanicSelector from './actions-mechanic'
import CreatePDF from './actions-pdf'
import QualityCheck from './actions-quality'

const StyledJobActions = styled.div`
  margin: 20px 0;
  display: block;
  justify-content: space-between;
  align-items: top;
  .stepper {
    margin-bottom: 10px;
    .MuiStepper-root {
      padding: 10px 0 0 0;
      overflow: hidden;
    }
    .Mui-disabled {
      .MuiStepIcon-root {
        color: #00000030;
        &.MuiStepIcon-active {
          color: #4794fc;
        }
      }
    }
  }
  .btns {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    button {
      margin-left: 10px;
      margin-bottom: 5px;

      &.paid {
        color: #FFFFFF;
        background-color: #0089fa;
      }
    }
  }
  ${({ theme }) => `
    ${theme.breakpoints.down('xs')} {
      flex-direction: column;
      .stepper {
        margin-bottom: 10px;
      }
      .btns {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        button {
          margin-left: 0;
          margin-right: 10px;
        }
      }
    }`}
`

function JobActions() {
  const { item, loading, updateJobStatus, markAsPaid, markAsUnPaid } = useContext(JobsDetailsContext)

  const { showConfirm } = useConfirm()

  const onSetStatus = (status) => {
    console.log('next status', status)
    let doUpdate = true
    switch (status) {
      case 'in-progress': {
        if (['cancelled', 'completed'].includes(item.status)) {
          showConfirm({
            onConfirm: () => updateJobStatus(status),
          })
          doUpdate = false
        }
        if (!item.mechanic) {
          showWarning('Please select a mechanic first')
          doUpdate = false
        }
        break
      }
      case 'cancelled':
      case 'completed': {
        showConfirm({
          onConfirm: () => updateJobStatus(status),
        })
        doUpdate = false
        break
      }
    }

    doUpdate && updateJobStatus(status)
  }

  const togglePaidStatus = () => {
    // need to confirm before update the job
    showConfirm({
      title: item.paid ? 'Mark as NOT paid' : 'Mark as paid',
      onConfirm: () => item.paid ? markAsUnPaid() : markAsPaid(),
    })
  }

  const steps = [
    {
      key: 'new',
      label: 'New',
      disabled: !['new', 'in-progress'].includes(item?.status),
      completed: false,
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      disabled: !['new', 'in-progress'].includes(item?.status),
      completed: false,
    },
    {
      key: 'quality-check',
      label: 'Quality Check',
      disabled: !['in-progress', 'quality-check', 'ready'].includes(item?.status),
      completed: false,
    },
    {
      key: 'ready',
      label: 'Ready for Pick Up',
      disabled: !['ready', 'completed'].includes(item?.status),
      completed: false,
    },
    {
      key: 'completed',
      label: 'Completed',
      disabled: !['ready', 'completed'].includes(item?.status),
      completed: false,
    },
  ]

  const activeStep = steps.findIndex((elm) => elm.key === item?.status)
  const availableNextStatus =
    CONSTANTS.JOB_STATUS_MAPPING[item?.status]?.map((elm) => elm.next) || []

  const renderSteps = () => {
    return (
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step) => (
          <Step
            key={step.key}
            disabled={!availableNextStatus.includes(step.key) || step.disabled}
            completed={step.completed}
          >
            <StepButton
              onClick={() => {
                onSetStatus(step.key)
              }}
            >
              <StepLabel>{step.label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    )
  }

  const renderMarkAsPaidBtn = () => {
    return (
      <Button
        className={item?.paid ? 'paid' : ''}
        variant="contained"
        data-cy="mark-paid"
        onClick={() => togglePaidStatus()}
        disabled={loading}
        startIcon={<AttachMoneyIcon />}
      >
        {item?.paid ? 'Paid' : 'Mark as paid'}
      </Button>
    )
  }

  return (
    <StyledJobActions>
      <div className="stepper">{renderSteps()}</div>
      <div className="btns">
        <QualityCheck />
        <CreatePDF />
        <MechanicSelector />
        {renderMarkAsPaidBtn()}
        <CallLog />
        <SendSMS />
      </div>
    </StyledJobActions>
  )
}

export default JobActions
