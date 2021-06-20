import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import About from './steps/about'
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

function getStepContent(step, initialData) {
  let StepForm = About
  if (step === 0) {
    StepForm = About
  } else if (step === 1) {
    StepForm = Contact
  }
  return <StepForm initialData={initialData} />
}

export default function HorizontalLinearStepper() {
  const classes = useStyles()

  return (
    <RegisterProvider>
      <RegisterContext.Consumer>
        {({ activeStep, steps, handleReset, stepsModel }) => (
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
                <div>{getStepContent(activeStep, stepsModel[steps[activeStep]])}</div>
              )}
            </div>
          </div>
        )}
      </RegisterContext.Consumer>
    </RegisterProvider>
  )
}
