import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Contact from './steps/contact'
import { RegisterProvider, RegisterContext } from './steps/context'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '70%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Contact />
    case 1:
      return 'Contact info'
    case 2:
      return 'Emergency contact'
    case 3:
      return 'Choose your profile picture'
    case 4:
      return 'Agree to terms and create account'
  }
}

export default function HorizontalLinearStepper() {
  const classes = useStyles()

  return (
    <RegisterProvider>
      <RegisterContext.Consumer>
        {({ activeStep, steps, handleReset }) => (
          <div className={classes.root}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => {
                const stepProps = {}
                const labelProps = {}
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                    <pre>Form data that will be submitted goes here</pre>
                  </Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                </div>
              ) : (
                <div>{getStepContent(activeStep)}</div>
              )}
            </div>
          </div>
        )}
      </RegisterContext.Consumer>
    </RegisterProvider>
  )
}
