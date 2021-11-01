import React, { useContext } from 'react'
import styled from 'styled-components'

import { Stepper, Step, StepButton, StepLabel, IconButton } from '@material-ui/core'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

import { ServiceContext } from './context.js'

const StyledSteps = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 550px;
  margin: 0 auto;

  .nav-btns {
    padding: 3px;
    border: 1px solid;
    border-radius: 3px;
  }
  .stepper {
    padding: 12px 0;
    margin: 0 5px;
    flex: 1;
    background-color: unset;
    border: 1px solid #00000050;
    border-radius: 5px;
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
  .custom-stepper {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    .step-item {
      flex: 1;
    }
  }
`}
`

function FromSteps() {
  const { steps, setActiveStep, activeStep, goNext, goBack } = useContext(ServiceContext)

  const onItemClick = (key) => {
    // we may disable this due to complicate logic handle
    setActiveStep(key)
  }

  const renderSteper = () => {
    // return (
    //   <div className="custom-stepper">
    //     {Object.keys(steps).map((key) => {
    //       const { disabled, completed, label, error } = steps[key]
    //       return (
    //         <div key={key} className="step-item">
    //           {label}
    //         </div>
    //       )
    //     })}
    //   </div>
    // )
    return (
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
    )
  }

  // find the active steps base on the key value?
  return (
    <StyledSteps>
      <IconButton className="nav-btns" onClick={() => goBack && goBack()}>
        <KeyboardArrowLeftIcon />
      </IconButton>
      {renderSteper()}
      <IconButton className="nav-btns" onClick={() => goNext && goNext()}>
        <KeyboardArrowRightIcon />
      </IconButton>
    </StyledSteps>
  )
}

export default FromSteps
