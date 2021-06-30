import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Stepper, Step, StepLabel, Button, Typography } from '@material-ui/core'

import RegisterProvider, { RegisterContext } from './context'
import StepBody from './step-body'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  formHeading: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  stepper: {
    width: '80%',
    margin: 'auto',
  },
  stepContent: {
    width: '60%',
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    padding: '1em',
  },
  progress: {
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    display: 'block',
  },
  progressContainer: {
    width: '100%',
  },
}))

const Register = () => {
  const classes = useStyles()

  return (
    <RegisterProvider>
      <div className={classes.root}>
        <Typography variant="h1" className={classes.title}>
          Registration
        </Typography>
        <RegisterContext.Consumer>
          {({ activeStep, steps, dispatch }) => (
            <>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                className={classes.stepper}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div className={classes.stepContent}>
                {activeStep === steps.length ? (
                  <div>
                    <h1>Registration Complete</h1>

                    <br />
                    <Button onClick={() => dispatch({ type: 'go_reset' })}>Reset</Button>
                  </div>
                ) : (
                  <StepBody />
                )}
              </div>
            </>
          )}
        </RegisterContext.Consumer>
      </div>
    </RegisterProvider>
  )
}

export default Register
