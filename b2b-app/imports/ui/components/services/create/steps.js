import React, { useContext } from 'react'
import styled from 'styled-components'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import StepLabel from '@material-ui/core/StepLabel'

import { ServiceContext } from './context.js'

const StyledSteps = styled.div`
  ${({ theme }) => `
  .stepper {
    padding: 12px 10px;
  }
  .step-item {
    .step-button {
      &:disabled {
        .icon-container {
          svg {
            color: #455656bd;
          }
        }
      }
    }
    .label {
      .label-container > span {
        margin-top: 5px;
      }
      .label-container {
        margin-top: 5px;
        word-break: break-all;
        .active {
          color: ${theme.palette.primary.main};
        }
        .completed {

        }
      }
    }
  }
`}
`

function FromSteps() {
  const { steps, setActiveStep, activeStep } = useContext(ServiceContext)

  const onItemClick = (key) => {
    // we may disable this due to complicate logic handle
    setActiveStep(key)
  }

  // find the active steps base on the key value?
  return (
    <StyledSteps>
      <Stepper alternativeLabel className="stepper">
        {Object.keys(steps).map((key) => {
          const { disabled, completed, label, error } = steps[key]
          return (
            <Step
              key={key}
              className="step-item"
              disabled={disabled}
              completed={completed}
              active={activeStep === key}
            >
              <StepButton className="step-button" onClick={() => onItemClick(key)}>
                <StepLabel
                  className="label"
                  classes={{
                    labelContainer: 'label-container',
                    active: 'active',
                    completed: 'completed',
                    iconContainer: 'icon-container',
                  }}
                  error={error === true}
                  completed={completed === true}
                >
                  {label}
                </StepLabel>
              </StepButton>
            </Step>
          )
        })}
      </Stepper>
    </StyledSteps>
  )
}

export default FromSteps
