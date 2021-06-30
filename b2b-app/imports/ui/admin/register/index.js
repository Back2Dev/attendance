import { meteorCall } from '/imports/ui/utils/meteor'
import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Stepper, Step, StepLabel, Button, Typography } from '@material-ui/core'

import { ContactForm, AboutForm, EmergencyForm, ConfirmForm } from './forms'
import useRegisterReducer from './useRegisterReducer'

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

function getStepLabels() {
  return ['Contact details', 'About you', 'Emergency contact', 'Confirm']
}

function getStepHeading(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Let's start with some basic contact details"
    case 1:
      return "Let's learn a bit about you"
    case 2:
      return 'Who should we contact in an emergency?'
    case 3:
      return "Just making sure everything's correct"
    default:
      return 'Unknown stepIndex'
  }
}

const formComponents = [ContactForm, AboutForm, EmergencyForm, ConfirmForm]

const Register = () => {
  const classes = useStyles()
  const steps = getStepLabels()
  const [
    { activeStep, models, isEditingStep, isSubmitting },
    dispatch,
  ] = useRegisterReducer(steps.length)

  useEffect(() => {
    const submitData = async () => {
      console.log('sending to server')
      if (!isSubmitting) return

      const s = await meteorCall(
        'insert.registrations',
        'saving',
        Object.assign({}, ...models)
      )

      if (s?.status === 'success') {
        dispatch({ type: 'submit_success' })
      } else if (s?.status === 'failure') {
        dispatch({ type: 'submit_fail' })
      }
    }
    submitData()
  }, [isSubmitting])

  const getForm = (index) => {
    let Form = formComponents[index]
    const handleSubmit = (model) => {
      if (isEditingStep) {
        dispatch({ type: 'go_last', model })
      } else if (activeStep === steps.length - 1) {
        dispatch({ type: 'go_submit', model })
      } else if (activeStep in steps) {
        dispatch({ type: 'go_next', model })
      }
    }
    const handleBack = (model) => {
      dispatch({ type: 'go_back', model })
    }
    const handleStepEdit = (step) => {
      dispatch({ type: 'go_edit_step', step })
    }

    return (
      <Form
        onSubmit={handleSubmit}
        model={models[index]}
        onBack={handleBack}
        // TODO: This seems like a bad idea
        models={models}
        onStepEdit={handleStepEdit}
        isEditingStep={isEditingStep}
        isSubmitting={isSubmitting}
      />
    )
  }

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={classes.title}>
        Registration
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className={classes.stepContent}>
        {activeStep === steps.length ? (
          // What to display when completed all form steps
          <div>
            <h1>Registration Complete</h1>

            <br />
            <Button onClick={() => dispatch({ type: 'go_reset' })}>Reset</Button>
          </div>
        ) : (
          // Display the appropriate form page
          <div>
            <Typography variant="h2" className={classes.formHeading}>
              {getStepHeading(activeStep)}
            </Typography>

            {/* TODO Display correct form and save to state on submit, incrementing stepper if successful */}
            {getForm(activeStep)}

            {/* <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
